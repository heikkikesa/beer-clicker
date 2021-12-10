import { useCallback, useEffect, useState } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from "@mui/material/Grid";

import { allUpgrades, Upgrade, Upgrades } from "../items/upgrades";
import ClickerComponent from "./Clicker";
import AssetsComponent from "./Assets";
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
import { allGeneralUpgrades, GeneralUpgrade } from "../items/generalUpgrades";
import GeneralUpgradesComponent from "./GeneralUpgrades";

const PRICE_MULTIPLIER = 1.15;
const AUTOCLICKER_TRIGGER = "employee";
const UPDATE_INTERVAL = 100;
const SAVE_INTERVAL = 1000 * 60 * 1; // 1 minute
export const bps_multiplier = 1000 / UPDATE_INTERVAL;

type Save = {
  beerCount: number;
  assets: Assets;
  upgrades: Upgrades;
  generalUpgrades: GeneralUpgrade[];
  autoClickerEnabled: boolean;
  clicks: number;
};

/*
  Plan:
  - IN PROGRESS: general upgrades, like beer styles (not attached to any building, multiplies the final output)
  - more assets and upgrades (requires buying icons)
  - better prices and coefficients
  - Firebase hosting
  - more stats (show how many)
  - click amount when clicking
  - achievements (also keep count of different things, like: total clicks, certain BPS and BPC, etc.)
*/

/*
  Continue from here:
    Finalize general upgrades.
    Prevent buying if already active (by disabling in UI and then checking in buy function).
    The styling.
*/

// icon attributions
/*
  <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
  <div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
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
  const [assets, setAssets] = useState<Assets>(initialAssets);
  const [upgrades, setUpgrades] = useState<Upgrades>({});
  const [generalUpgrades, setGeneralUpgrades] = useState<GeneralUpgrade[]>([]);
  const [autoClickerEnabled, setAutoclickerEnabled] = useState(false);
  const [clicks, setClicks] = useState(0);

  const save = () => {
    const data: Save = {
      beerCount,
      assets,
      upgrades,
      generalUpgrades,
      autoClickerEnabled,
      clicks,
    };
    localStorage.setItem("saveData", JSON.stringify(data));
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
      console.log("Can't afford");
      return;
    }

    const assetData = allAssets[asset.id];
    const upgradeData = allUpgrades[asset.id];

    // pay
    setBeerCount(beerCount - asset.price);

    // raise the count of that amount of assets
    assets[asset.id].amount = assets[asset.id].amount + 1;

    // raise price of the asset
    assets[asset.id].price = Math.round(
      assets[asset.id].price * PRICE_MULTIPLIER
    );

    // calculate the bpc and pbs here
    assets[asset.id].bpc = calculateAssetBPC(
      assets[asset.id],
      assetData,
      upgrades,
      upgradeData,
      generalUpgrades,
      allGeneralUpgrades
    );

    assets[asset.id].bps = calculateAssetBPS(
      assets[asset.id],
      assetData,
      upgrades,
      upgradeData,
      generalUpgrades,
      allGeneralUpgrades
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
    setUpgrades(updatedUpgrades);

    const assetData = allAssets[assetId];
    const upgradeData = allUpgrades[assetId];

    assets[assetId].bpc = calculateAssetBPC(
      assets[assetId],
      assetData,
      upgrades,
      upgradeData,
      generalUpgrades,
      allGeneralUpgrades
    );

    assets[assetId].bps = calculateAssetBPS(
      assets[assetId],
      assetData,
      upgrades,
      upgradeData,
      generalUpgrades,
      allGeneralUpgrades
    );
    setAssets(assets);

    updatePerSecondAmounts(assets);
  };

  const buyGeneralUpgrade = (id: string) => {
    const upgradeData = allGeneralUpgrades.find((upgrade) => upgrade.id === id);
    if (upgradeData === undefined) {
      return;
    }

    if (upgradeData.price > beerCount) {
      console.log("Can't afford");
      return;
    }

    // check if already bought
    const bought = generalUpgrades.some((upgrade) => upgrade.id === id);
    if (bought) {
      console.log("Already owned");
      return;
    }

    // pay
    setBeerCount(beerCount - upgradeData.price);

    const updatedGeneralUpgrades: GeneralUpgrade[] = [
      ...generalUpgrades,
      { id, active: true } as GeneralUpgrade,
    ];

    // add to list
    setGeneralUpgrades(updatedGeneralUpgrades);

    // iterate over assets and calculate new speeds
    const recalculatedAssets: Assets = Object.fromEntries(
      Object.entries(assets).map(([assetId, asset]) => {
        const assetData = allAssets[assetId];
        const upgradeData = allUpgrades[assetId];
        const bps = calculateAssetBPS(
          asset,
          assetData,
          upgrades,
          upgradeData,
          updatedGeneralUpgrades,
          allGeneralUpgrades
        );
        const bpc = calculateAssetBPC(
          asset,
          assetData,
          upgrades,
          upgradeData,
          updatedGeneralUpgrades,
          allGeneralUpgrades
        );
        const updatedAsset: Asset = {
          ...asset,
          bps,
          bpc,
        };
        return [assetId, updatedAsset];
      })
    );
    setAssets(recalculatedAssets);

    // update total speed
    updatePerSecondAmounts(recalculatedAssets);
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
        setGeneralUpgrades(data.generalUpgrades);
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
        <ClickerComponent
          beerCount={beerCount}
          bpc={bpc}
          bps={bps}
          autoClickerEnabled={autoClickerEnabled}
          click={click}
          showTooltip={clicks < 5}
        />
        <GeneralUpgradesComponent
          beerCount={beerCount}
          generalUpgrades={generalUpgrades}
          buyGeneralUpgrade={buyGeneralUpgrade}
        />
      </Grid>
      <Grid item md={8} xs={12}>
        <AssetsComponent
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
