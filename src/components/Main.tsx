import { useCallback, useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import {
  allUpgrades,
  //initialUpgrades,
  Upgrade,
  Upgrades,
} from "../items/upgrades";
import ClickerArea from "./ClickerArea";
import AssetsArea from "./AssetsArea";
import { allAssets, Asset, Assets, initialAssets } from "../items/assets";
import {
  calculateAssetBPC,
  calculateAssetBPS,
  calculateTotalBPC,
  calculateTotalBPS,
  handleActiveUpgrades,
  handleAssetPurchaseStatuses,
  handleAvailableUpgrades,
  useInterval,
} from "../helpers/functions";

const PRICE_MULTIPLIER = 1.15;
const AUTOCLICKER_TRIGGER = "employee";
const UPDATE_INTERVAL = 100;
const SAVE_INTERVAL = 1000 * 60 * 1; // 1 minute
export const bps_multiplier = 1000 / UPDATE_INTERVAL;

type Save = {
  beerCount: number;
  assets: Assets;
  upgrades: Upgrades;
  autoClickerEnabled: boolean;
  clicks: number;
};

/*
  Plan:
  - more stats (show how many)
  - more assets and upgrades
  - better prices and coefficients
  - format long numbers to show words (million, trillion, etc.) (also for prices)
  - general upgrades, like beer styles (not attached to any building, multiplies the final output)
  - achievements (also keep count of different things, like: total clicks, certain BPS and BPC, etc.)
*/

/*
  multipliers:
  cursor: 50: 16255
  mine: 18: 148506
  factory: 2: 171925 3: 197714 4: 227371 5: 261477 12: 695533
  factory 2->3 25789 3->4 29657 4->5 34106
*/

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rootGrid: {
      marginTop: 0,
      height: "100%",
    },
    clickerArea: {
      color: "#fff",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
    },
  })
);

const Main = () => {
  const classes = useStyles();

  const [loaded, setLoaded] = useState(false);
  const [beerCount, setBeerCount] = useState(0);
  const [bpc, setBPC] = useState(1); // beer per manual click
  const [bps, setBPS] = useState(0); // beer per second (automatic)
  //const [assets, setAssets] = useState(initialAssets);
  const [assets, setAssets] = useState<Assets>(initialAssets);
  const [upgrades, setUpgrades] = useState<Upgrades>({});
  const [autoClickerEnabled, setAutoclickerEnabled] = useState(false);
  const [clicks, setClicks] = useState(0);

  const save = () => {
    const data: Save = {
      beerCount,
      assets,
      upgrades,
      autoClickerEnabled,
      clicks,
    };
    localStorage.setItem("saveData", JSON.stringify(data));
    console.log(beerCount);
    console.log("saved");
  };

  const click = useCallback(() => {
    setBeerCount(beerCount + bpc);
    setClicks(clicks + 1);
  }, [beerCount, bpc, clicks]);

  const autoBrew = useCallback(() => {
    if (autoClickerEnabled) {
      setBeerCount(beerCount + bps);
    }
  }, [beerCount, bps, autoClickerEnabled]);

  const updatePerSecondAmounts = (assets: Assets) => {
    // calculate new bpc
    const newBPC = calculateTotalBPC(assets);
    setBPC(newBPC);

    // calculate new bps
    const newBPS = calculateTotalBPS(assets);
    setBPS(newBPS);
  };

  const buyAsset = (asset: Asset) => {
    // buying should also cost something
    if (asset.price > beerCount) {
      console.log("Can't afford"); // TODO: show alert or something (also the possibility to buy should be disabled)
      return;
    }

    const assetData = allAssets[asset.id];
    const upgradeData = allUpgrades[asset.id];

    // pay
    setBeerCount(beerCount - asset.price);

    // raise the count of that amount of assets
    assets[asset.id].amount = assets[asset.id].amount + 1;

    // raise price of the asset
    // TODO: calculate the price by using amount and multipliers (compounding price)
    assets[asset.id].price = Math.round(
      assets[asset.id].price * PRICE_MULTIPLIER
    );

    // calculate the bpc and pbs here
    assets[asset.id].bpc = calculateAssetBPC(
      assets[asset.id],
      upgrades,
      assetData,
      upgradeData
    );

    assets[asset.id].bps = calculateAssetBPS(
      assets[asset.id],
      upgrades,
      assetData,
      upgradeData
    );

    // activate autoClicker if needed
    if (!autoClickerEnabled && asset.id === AUTOCLICKER_TRIGGER) {
      enableAutoClicker();
    }

    // update asset statuses if this was the first purchase of the asset
    const statusUpdatedAssets = handleAssetPurchaseStatuses(
      assets,
      asset.id,
      allAssets
    );

    // update assets list
    setAssets(statusUpdatedAssets);

    // update available updates list
    const updatedUpgrades = handleAvailableUpgrades(
      upgrades,
      asset.id,
      assets[asset.id].amount,
      allUpgrades
    );
    setUpgrades(updatedUpgrades);

    updatePerSecondAmounts(assets);
  };

  const buyUpgrade = (upgrade: Upgrade, assetId: string) => {
    const assetUpgrades = allUpgrades[assetId];
    const assetUpgradeData = assetUpgrades.find(
      (assetUpgrade) => assetUpgrade.id === upgrade.id
    );
    if (assetUpgradeData === undefined || assetUpgradeData.price > beerCount) {
      console.log("Can't afford");
      return;
    }

    // pay
    setBeerCount(beerCount - assetUpgradeData.price);

    // change the upgrade status to active
    const updatedUpgrades = handleActiveUpgrades(upgrades, upgrade.id, assetId);
    console.log(updatedUpgrades);
    setUpgrades(updatedUpgrades);

    const assetData = allAssets[assetId];
    const upgradeData = allUpgrades[assetId];

    assets[assetId].bpc = calculateAssetBPC(
      assets[assetId],
      upgrades,
      assetData,
      upgradeData
    );

    assets[assetId].bps = calculateAssetBPS(
      assets[assetId],
      upgrades,
      assetData,
      upgradeData
    );
    setAssets(assets);

    updatePerSecondAmounts(assets);
  };

  const enableAutoClicker = () => {
    setAutoclickerEnabled(true);
  };

  useEffect(() => {
    // try to load data from localStorage if everything is empty
    if (!loaded) {
      const saveJSON = localStorage.getItem("saveData");
      if (saveJSON) {
        const data: Save = JSON.parse(saveJSON);
        setBeerCount(data.beerCount);
        setAssets(data.assets);
        setUpgrades(data.upgrades);
        setAutoclickerEnabled(data.autoClickerEnabled);
        setClicks(data.clicks);

        updatePerSecondAmounts(data.assets);
      }
      setLoaded(true);
    }
  }, [loaded]);

  useInterval(() => {
    autoBrew();
  }, UPDATE_INTERVAL);

  useInterval(() => {
    save();
  }, SAVE_INTERVAL);

  return (
    <Grid container spacing={3} className={classes.rootGrid}>
      <Grid item md={4} xs={12} className={classes.clickerArea}>
        <ClickerArea
          beerCount={beerCount}
          bpc={bpc}
          bps={bps}
          autoClickerEnabled={autoClickerEnabled}
          click={click}
        />
      </Grid>
      <Grid item md={8} xs={12}>
        <AssetsArea
          beerCount={beerCount}
          totalBPS={bps}
          assets={assets}
          upgrades={upgrades}
          autoClickerEnabled={autoClickerEnabled}
          buyAsset={buyAsset}
          buyUpgrade={buyUpgrade}
        />
      </Grid>
    </Grid>
  );
};

export default Main;
