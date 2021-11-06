import { useEffect, useRef } from "react";
import {
  Asset,
  AssetData,
  AssetDatas,
  Assets,
  AssetStatus,
} from "../items/assets";
import {
  Upgrade,
  UpgradeData,
  UpgradeDatas,
  Upgrades,
  UpgradeStatus,
} from "../items/upgrades";

export const calculateAssetBPC = (
  asset: Asset,
  upgrades: Upgrades,
  assetData: AssetData,
  upgradeDatas: UpgradeData[]
): number => {
  // Upgrades give multipliers on top of asset output
  const assetBaseOutput = assetData.bpcCoefficient * asset.amount;
  // Calculate final output after compounding interest
  let multipliers: number[] = [];
  if (upgrades[asset.id] !== undefined) {
    multipliers = upgrades[asset.id]
      .map((assetUpgrade) => {
        const multiplier = upgradeDatas.find(
          (data) => assetUpgrade.id === data.id
        )!.multiplier;
        return assetUpgrade.status === UpgradeStatus.Active ? multiplier : 1;
      })
      .filter((multiplier) => multiplier !== 1);
  }
  const assetTotalOutput = multipliers.reduce(
    (assetTotal, multiplier) => assetTotal * multiplier,
    assetBaseOutput
  );
  return Math.round(assetTotalOutput);
  //return Math.round(total + assetTotalOutput);
};

// TODO: this is very similar to calculateAssetBPC, consider refactoring into one
export const calculateAssetBPS = (
  asset: Asset,
  upgrades: Upgrades,
  assetData: AssetData,
  upgradeDatas: UpgradeData[]
): number => {
  // Upgrades give multipliers on top of asset output
  const assetBaseOutput = assetData.bpsCoefficient * asset.amount;
  // Calculate final output after compounding interest
  let multipliers: number[] = [];
  if (upgrades[asset.id] !== undefined) {
    multipliers = upgrades[asset.id]
      .map((assetUpgrade) => {
        const multiplier = upgradeDatas.find(
          (data) => assetUpgrade.id === data.id
        )!.multiplier;
        return assetUpgrade.status === UpgradeStatus.Active ? multiplier : 1;
      })
      .filter((multiplier) => multiplier !== 1);
  }
  const assetTotalOutput = multipliers.reduce(
    (assetTotal, multiplier) => assetTotal * multiplier,
    assetBaseOutput
  );
  return assetTotalOutput;
  //return Math.round(total + assetTotalOutput);
};

export const calculateTotalBPC = (assets: Assets): number => {
  // Beers-Per-Click is calculated by assets bpc value times amount owned
  return Object.values(assets).reduce((total, asset) => total + asset.bpc, 1);
  /*
    // Upgrades give multipliers on top of asset output
    const assetBaseOutput = asset.bpc * asset.amount;
    // Calculate final output after compounding interest
    let multipliers: number[] = [];
    if (upgrades[asset.id] !== undefined) {
      multipliers = upgrades[asset.id]
        .map((assetUpgrade) =>
          assetUpgrade.status === UpgradeStatus.Active
            ? assetUpgrade.multiplier
            : 1
        )
        .filter((multiplier) => multiplier !== 1);
    }
    const assetTotalOutput = multipliers.reduce(
      (assetTotal, multiplier) => assetTotal * multiplier,
      assetBaseOutput
    );
    return Math.round(total + assetTotalOutput);
    */
};

// TODO: this is very similar to calculateBPC, consider refactoring into one
export const calculateTotalBPS = (assets: Assets): number => {
  // Beers-Per-Second is calculated by assets bps value times amount owned
  return Object.values(assets).reduce((total, asset) => total + asset.bps, 0);

  /*
  return Object.values(assets).reduce((total, asset) => {
    // Upgrades give multipliers on top of asset output
    const assetBaseOutput = asset.bps * asset.amount;
    // Calculate final output after compounding interest
    let multipliers: number[] = [];
    if (upgrades[asset.id] !== undefined) {
      multipliers = upgrades[asset.id]
        .map((assetUpgrade) =>
          assetUpgrade.status === UpgradeStatus.Active
            ? assetUpgrade.multiplier
            : 1
        )
        .filter((multiplier) => multiplier !== 1);
    }
    const assetTotalOutput = multipliers.reduce(
      (assetTotal, multiplier) => assetTotal * multiplier,
      assetBaseOutput
    );
    return total + assetTotalOutput;
  }, 0);
  */
};

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
  /*
  if (assetUpgrades === undefined) {
    return upgrades;
  }
  */

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

  /*
  const updatedAssetUpgrades = assetUpgrades.map((upgrade) => {
    if (
      upgrade.status === UpgradeStatus.Unavailable &&
      amount >= upgrade.availabilityRequirement
    ) {
      // we need to add the upgrade to current list
      upgrade.status = UpgradeStatus.Available;
    }
    return upgrade;
  });
  */

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

    /*
    const nextAsset = Object.values(assets).find(
      (asset) => asset.status === AssetStatus.Unavailable
    );
    */
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
      //assets[nextAsset.id].status = AssetStatus.Available;
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
