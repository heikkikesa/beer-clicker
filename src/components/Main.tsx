import { useCallback, useEffect, useRef, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import { initialUpgrades, Upgrade, Upgrades } from "../items/upgrades";
import ClickerArea from "./ClickerArea";
import AssetsArea from "./AssetsArea";
import { Asset, Assets, initialAssets } from "../items/assets";
import {
  calculateBPC,
  calculateBPS,
  handleActiveUpgrades,
  handleAssetPurchaseStatuses,
  handleAvailableUpgrades,
  useInterval,
} from "../helpers/functions";

const PRICE_MULTIPLIER = 1.15;
const AUTOCLICKER_TRIGGER = "employee";
const UPDATE_INTERVAL = 100;
//const SAVE_INTERVAL = 1000 * 60 * 5; // 5 minutes
const SAVE_INTERVAL = 1000 * 10; // 10 seconds
const bps_multiplier = 1000 / UPDATE_INTERVAL;

type Save = {
  beerCount: number;
  assets: Assets;
  upgrades: Upgrades;
  autoClickerEnabled: boolean;
};

/*
  Plan:
  - show statistics and additional information about assets
  - format long numbers to show words (million, trillion, etc.) (also for prices)
  - autosave into local storage (every minute or something else?) (and enable save export/import)
  - general upgrades, like beer styles (not attached to any building, multiplies the final output)
  - achievements (also keep count of different things, like: total clicks, certain BPS and BPC, etc.)
  - how to upgrade the asset and upgrade list so that old users get the updated elements?
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
      //alignItems: "stretch",
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

  // saving functionality
  // create an object
  /*
    {
      beerCount,
      assets,
      upgrades,
      autoClickerEnabled,
    }
  */
  // when loading page -> read the object and update all the states
  // might work automatically?

  const [loaded, setLoaded] = useState(false);
  const [beerCount, setBeerCount] = useState(0);
  const [bpc, setBPC] = useState(1); // beer per manual click
  const [bps, setBPS] = useState(0); // beer per second (automatic)
  const [assets, setAssets] = useState(initialAssets);
  const [upgrades, setUpgrades] = useState(initialUpgrades);
  const [autoClickerEnabled, setAutoclickerEnabled] = useState(false);
  const [autoClickerIntervalActive, setAutoClickerIntervalActive] =
    useState(false);

  const save = () => {
    const data: Save = {
      beerCount,
      assets,
      upgrades,
      autoClickerEnabled,
    };
    localStorage.setItem("saveData", JSON.stringify(data));
    console.log(beerCount);
    console.log("saved");
  };

  const click = useCallback(() => {
    setBeerCount(beerCount + bpc);
  }, [beerCount, bpc]);

  const autoBrew = useCallback(() => {
    if (autoClickerEnabled) {
      setBeerCount(beerCount + bps);
    }
  }, [beerCount, bps, autoClickerEnabled]);

  const updatePerSecondAmounts = (assets: Assets, upgrades: Upgrades) => {
    // calculate new bpc
    const newBPC = calculateBPC(assets, upgrades);
    setBPC(newBPC);

    // calculate new bps
    const newBPS = calculateBPS(assets, upgrades);
    setBPS(newBPS);
  };

  const buyAsset = (asset: Asset) => {
    // buying should also cost something
    if (asset.price > beerCount) {
      console.log("Can't afford"); // TODO: show alert or something (also the possibility to buy should be disabled)
      return;
    }

    // pay
    setBeerCount(beerCount - asset.price);

    // raise the count of that amount of assets
    assets[asset.id].amount = assets[asset.id].amount + 1;
    // raise price of the asset
    assets[asset.id].price = Math.round(
      assets[asset.id].price * PRICE_MULTIPLIER
    );

    // activate autoClicker if needed
    if (!autoClickerEnabled && asset.id === AUTOCLICKER_TRIGGER) {
      enableAutoClicker();
    }

    // update asset statuses if this was the first purchase of the asset
    const statusUpdatedAssets = handleAssetPurchaseStatuses(assets, asset.id);

    // update assets list
    setAssets(statusUpdatedAssets);

    // update available updates list
    const updatedUpgrades = handleAvailableUpgrades(
      upgrades,
      asset.id,
      assets[asset.id].amount
    );
    setUpgrades(updatedUpgrades);

    updatePerSecondAmounts(assets, upgrades);
  };

  const buyUpgrade = (upgrade: Upgrade, assetId: string) => {
    if (upgrade.price > beerCount) {
      console.log("Can't afford");
      return;
    }

    // pay
    setBeerCount(beerCount - upgrade.price);

    // change the upgrade status to active
    const updatedUpgrades = handleActiveUpgrades(upgrades, upgrade.id, assetId);
    setUpgrades(updatedUpgrades);

    updatePerSecondAmounts(assets, upgrades);
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

        updatePerSecondAmounts(data.assets, data.upgrades);
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
          bps_multiplier={bps_multiplier}
          click={click}
        />
      </Grid>
      <Grid item md={8} xs={12}>
        <AssetsArea
          beerCount={beerCount}
          assets={assets}
          upgrades={upgrades}
          buyAsset={buyAsset}
          buyUpgrade={buyUpgrade}
        />
      </Grid>
      <div onClick={save}>Save</div>
    </Grid>
  );
};

export default Main;
