import { useEffect, useRef } from "react";
import {
  Asset,
  AssetData,
  AssetDatas,
  Assets,
  AssetStatus,
} from "../items/assets";
import { GeneralUpgrade, GeneralUpgradeData } from "../items/generalUpgrades";
import {
  Upgrade,
  UpgradeData,
  UpgradeDatas,
  Upgrades,
  UpgradeStatus,
} from "../items/upgrades";

// Upgrades give multipliers that must be calculated as compounding interest
const calculateCompoundingInterests = (
  base: number,
  assetId: string,
  upgrades: Upgrades,
  upgradeDatas: UpgradeData[],
  generalUpgrades: GeneralUpgrade[],
  allGeneralUpgrades: GeneralUpgradeData[]
): number => {
  let multipliers: number[] = [];
  // Add the upgrade multipliers
  if (upgrades[assetId] !== undefined) {
    multipliers = upgrades[assetId]
      .map((assetUpgrade) => {
        const multiplier = upgradeDatas.find(
          (data) => assetUpgrade.id === data.id
        )!.multiplier;
        return assetUpgrade.status === UpgradeStatus.Active ? multiplier : 1;
      })
      .filter((multiplier) => multiplier !== 1);
  }
  // Add the general upgrade multipliers
  if (generalUpgrades.length > 0) {
    const generalUpgradeMultipliers = generalUpgrades.map((generalUpgrade) => {
      const generalUpgradeData = allGeneralUpgrades.find(
        (generalUpgradeData) => generalUpgradeData.id === generalUpgrade.id
      );
      if (generalUpgradeData === undefined) {
        return 1;
      }
      return generalUpgradeData.multiplier;
    });
    multipliers = [...multipliers, ...generalUpgradeMultipliers];
  }
  // Calculate final output after compounding interest
  return multipliers.reduce(
    (assetTotal, multiplier) => assetTotal * multiplier,
    base
  );
};

export const calculateAssetBPC = (
  asset: Asset,
  assetData: AssetData,
  upgrades: Upgrades,
  upgradeDatas: UpgradeData[],
  generalUpgrades: GeneralUpgrade[],
  allGeneralUpgrades: GeneralUpgradeData[]
): number => {
  const assetBaseOutput = assetData.bpcCoefficient * asset.amount;
  return calculateCompoundingInterests(
    assetBaseOutput,
    asset.id,
    upgrades,
    upgradeDatas,
    generalUpgrades,
    allGeneralUpgrades
  );
};

export const calculateAssetBPS = (
  asset: Asset,
  assetData: AssetData,
  upgrades: Upgrades,
  upgradeDatas: UpgradeData[],
  generalUpgrades: GeneralUpgrade[],
  allGeneralUpgrades: GeneralUpgradeData[]
): number => {
  const assetBaseOutput = assetData.bpsCoefficient * asset.amount;
  return calculateCompoundingInterests(
    assetBaseOutput,
    asset.id,
    upgrades,
    upgradeDatas,
    generalUpgrades,
    allGeneralUpgrades
  );
};

export const calculateTotalBPC = (assets: Assets): number =>
  Object.values(assets).reduce((total, asset) => total + asset.bpc, 1);

// TODO: this is very similar to calculateBPC, consider refactoring into one
export const calculateTotalBPS = (assets: Assets): number =>
  Object.values(assets).reduce((total, asset) => total + asset.bps, 0);

// Iterate over bought assets upgrades and change their status to available if not available
export const handleAvailableUpgrades = (
  upgrades: Upgrades,
  assetId: string,
  amount: number,
  allUpgrades: UpgradeDatas
): Upgrades => {
  const assetUpgrades = upgrades[assetId];
  const assetUpgradeData = allUpgrades[assetId];
  if (assetUpgradeData === undefined) {
    return upgrades;
  }

  const updatedAssetUpgrades = assetUpgradeData
    .map((upgradeData) => {
      if (assetUpgrades === undefined) {
        return null;
      }
      // if the item is already in the list -> copy it here
      const existingUpgrade = assetUpgrades.find(
        (upgrade) => upgrade.id === upgradeData.id
      );
      if (existingUpgrade !== undefined) {
        return existingUpgrade;
      }
      // if the item is not in the list but should be available -> add with Available status
      if (amount >= upgradeData.availabilityRequirement) {
        const newUpgrade: Upgrade = {
          id: upgradeData.id,
          status: UpgradeStatus.Available,
        };
        return newUpgrade;
      }
      return null;
    })
    .filter((upgrade) => upgrade !== null);

  upgrades[assetId] = updatedAssetUpgrades as Upgrade[];
  return upgrades;
};

export const handleActiveUpgrades = (
  upgrades: Upgrades,
  upgradeId: string,
  assetId: string
): Upgrades => {
  const assetUpgrades = upgrades[assetId];
  if (assetUpgrades === undefined) {
    return upgrades;
  }
  const updatedAssetUpgrades = assetUpgrades.map((assetUpgrade) => {
    if (
      assetUpgrade.id === upgradeId &&
      assetUpgrade.status === UpgradeStatus.Available
    ) {
      assetUpgrade.status = UpgradeStatus.Active;
    }
    return assetUpgrade;
  });
  upgrades[assetId] = updatedAssetUpgrades;
  const updatedUpgrades: Upgrades = { ...upgrades }; // React doesn't track the changes of arrays inside objects, we have to create new object to trigger re-render
  return updatedUpgrades;
};

// when purchasing asset for the first time, set its status to Purchased and the next asset to Available
export const handleAssetPurchaseStatuses = (
  assets: Assets,
  assetId: string,
  allAssets: AssetDatas
): Assets => {
  if (assets[assetId].status === AssetStatus.Available) {
    // Asset was purchased for the first time
    assets[assetId].status = AssetStatus.Purchased;

    // Add the next asset to list and set it to Available
    const assetKeys = Object.keys(allAssets);
    const nextIndex = assetKeys.indexOf(assetId) + 1;
    const nextKey = assetKeys[nextIndex];

    if (nextKey !== undefined) {
      const newAssetData = allAssets[nextKey];
      assets[nextKey] = {
        id: nextKey,
        amount: 0,
        bps: 0,
        bpc: 0,
        price: newAssetData.initialPrice,
        status: AssetStatus.Available,
      };
    }
  }
  return assets;
};

// Thanks for Dan Abramov for this
// source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
type TimerHandler = (...args: any[]) => void;
export const useInterval = (callback: TimerHandler, delay: number) => {
  const savedCallbackRef = useRef<TimerHandler>();

  useEffect(() => {
    savedCallbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (...args: any[]) => savedCallbackRef.current!(...args);

    if (delay !== null) {
      const intervalId = setInterval(handler, delay);
      return () => clearInterval(intervalId);
    }
  }, [delay]);
};

type LargeNumber = {
  name: string;
  zeros: number;
};
const largeNumbers: LargeNumber[] = [
  {
    zeros: 6,
    name: "million",
  },
  {
    zeros: 9,
    name: "billion",
  },
  {
    zeros: 12,
    name: "trillion",
  },
  {
    zeros: 15,
    name: "quadrillion",
  },
  {
    zeros: 18,
    name: "quintillion",
  },
  {
    zeros: 21,
    name: "sextillion",
  },
  {
    zeros: 24,
    name: "septillion",
  },
  {
    zeros: 27,
    name: "octillion",
  },
  {
    zeros: 30,
    name: "nonillion",
  },
  {
    zeros: 33,
    name: "decillion",
  },
  {
    zeros: 36,
    name: "undecillion",
  },
  {
    zeros: 39,
    name: "duodecillion",
  },
  {
    zeros: 42,
    name: "tredecillion",
  },
  {
    zeros: 45,
    name: "quattuordecillion",
  },
  {
    zeros: 48,
    name: "quindecillion",
  },
  {
    zeros: 51,
    name: "sexdecillion",
  },
  {
    zeros: 54,
    name: "septendecillion",
  },
  {
    zeros: 57,
    name: "octodecillion",
  },
  {
    zeros: 60,
    name: "novemdecillion",
  },
  {
    zeros: 63,
    name: "vigintillion",
  },
  {
    zeros: 66,
    name: "unvigintillion",
  },
  {
    zeros: 69,
    name: "duovigintillion",
  },
  {
    zeros: 72,
    name: "tresvigintillion",
  },
  {
    zeros: 75,
    name: "quattuorvigintillion",
  },
  {
    zeros: 78,
    name: "quinvigintillion",
  },
  {
    zeros: 81,
    name: "sesvigintillion",
  },
  {
    zeros: 84,
    name: "septemvigintillion",
  },
  {
    zeros: 87,
    name: "octovigintillion",
  },
  {
    zeros: 90,
    name: "novemvigintillion",
  },
  {
    zeros: 93,
    name: "trigintillion",
  },
  {
    zeros: 96,
    name: "untrigintillion",
  },
  {
    zeros: 99,
    name: "duotrigintillion",
  },
];

// Format the number to more readable format if it is over 1 million
export const formatLongNumber = (number: number): string => {
  const length = (Math.log(number) * Math.LOG10E + 1) | 0;
  if (length > 6) {
    // all the large numbers are divisible by three
    // divide by 3 and pick the integer minus 2, this is the index of largeNumbers
    const largeNumberIndex = Math.floor(length / 3) - 2;

    const baseNumber = Math.pow(10, largeNumbers[largeNumberIndex].zeros); // create the base number (million = 1000000)
    const shortNumber = (number / baseNumber).toFixed(2); // 24134564 => 24.13
    return `${shortNumber} million`;
  }
  return Math.round(number).toString();
};
