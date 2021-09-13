import { Assets, AssetStatus } from "../items/assets";
import { Upgrades, UpgradeStatus } from "../items/upgrades";

export const calculateBPC = (assets: Assets, upgrades: Upgrades): number => {
  // Beers-Per-Click is calculated by assets bpc value times amount owned
  return Object.values(assets).reduce((total, asset) => {
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
  }, 1);
};

// TODO: this is very similar to calculateBPC, consider refactoring into one
export const calculateBPS = (assets: Assets, upgrades: Upgrades): number => {
  // Beers-Per-Second is calculated by assets bps value times amount owned
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
    return Math.round(total + assetTotalOutput);
  }, 0);
};

// Iterate over bought assets upgrades and change their status to available if not available
export const handleAvailableUpgrades = (
  upgrades: Upgrades,
  assetId: string,
  amount: number
): Upgrades => {
  const assetUpgrades = upgrades[assetId];
  if (assetUpgrades === undefined) {
    return upgrades;
  }
  const updatedAssetUpgrades = assetUpgrades.map((upgrade) => {
    if (
      upgrade.status === UpgradeStatus.Unavailable &&
      amount >= upgrade.availabilityRequirement
    ) {
      upgrade.status = UpgradeStatus.Available;
    }
    return upgrade;
  });

  upgrades[assetId] = updatedAssetUpgrades;
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
  assetId: string
): Assets => {
  if (assets[assetId].status === AssetStatus.Available) {
    // Asset was purchased for the first time
    assets[assetId].status = AssetStatus.Purchased;

    // Set the next asset to Available
    const nextAsset = Object.values(assets).find(
      (asset) => asset.status === AssetStatus.Unavailable
    );
    if (nextAsset !== undefined) {
      assets[nextAsset.id].status = AssetStatus.Available;
    }
  }
  return assets;
};
