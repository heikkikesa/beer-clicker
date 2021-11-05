import { useCallback, useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import { initialUpgrades, Upgrade } from "../items/upgrades";
import ClickerArea from "./ClickerArea";
import UpgradesArea from "./UpgradesArea";
import AssetsArea from "./AssetsArea";
import { Asset, initialAssets } from "../items/assets";
import {
  calculateBPC,
  calculateBPS,
  handleActiveUpgrades,
  handleAssetPurchaseStatuses,
  handleAvailableUpgrades,
} from "../helpers/functions";

const PRICE_MULTIPLIER = 1.15;
const AUTOCLICKER_TRIGGER = "employee";
const UPDATE_INTERVAL = 100;
const bps_multiplier = 1000 / UPDATE_INTERVAL;

/*
  Plan:
  - layout
  - styling
  - show statistics and additional information about assets when hovering (or visible constantly)
  - autosave into local storage (every minute or something else?)
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
      alignItems: "stretch",
    },
    clickerArea: {
      color: "#fff",
      textAlign: "center",
    },
    upgradesArea: {},
    assetsArea: {},
  })
);

const Main = () => {
  const classes = useStyles();

  const [beerCount, setBeerCount] = useState(0);
  const [bpc, setBPC] = useState(1); // beer per manual click
  const [bps, setBPS] = useState(0); // beer per second (automatic)
  const [assets, setAssets] = useState(initialAssets);
  const [upgrades, setUpgrades] = useState(initialUpgrades);
  const [autoClickerEnabled, setAutoclickerEnabled] = useState(false);

  const click = useCallback(() => {
    setBeerCount(beerCount + bpc);
  }, [beerCount, bpc]);

  const autoBrew = useCallback(() => {
    setBeerCount(beerCount + bps);
  }, [beerCount, bps]);

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

    // calculate new bpc
    const newBPC = calculateBPC(assets, upgrades);
    setBPC(newBPC);

    // calculate new bps
    const newBPS = calculateBPS(assets, upgrades);
    setBPS(newBPS);
  };

  const buyUpgrade = (upgrade: Upgrade, assetId: string) => {
    if (upgrade.price > beerCount) {
      console.log("Can't afford");
      return;
    }

    // change the upgrade status to active
    const updatedUpgrades = handleActiveUpgrades(upgrades, upgrade.id, assetId);
    setUpgrades(updatedUpgrades);

    // calculate new BPS and BPC
    const newBPC = calculateBPC(assets, upgrades);
    setBPC(newBPC);

    const newBPS = calculateBPS(assets, upgrades);
    setBPS(newBPS);
  };

  const enableAutoClicker = () => {
    setAutoclickerEnabled(true);
  };

  useEffect(() => {
    if (autoClickerEnabled) {
      const interval = setInterval(() => autoBrew(), UPDATE_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [autoClickerEnabled, autoBrew]);

  return (
    <Grid container spacing={3} className={classes.rootGrid}>
      <Grid item xs={4} className={classes.clickerArea}>
        <ClickerArea
          beerCount={beerCount}
          bpc={bpc}
          bps={bps}
          autoClickerEnabled={autoClickerEnabled}
          bps_multiplier={bps_multiplier}
          click={click}
        />
      </Grid>
      <Grid item xs={8}>
        <Grid container spacing={3}>
          <Grid item xs={12} className={classes.assetsArea}>
            <AssetsArea
              beerCount={beerCount}
              assets={assets}
              buyAsset={buyAsset}
            />
          </Grid>
          <Grid item xs={12} className={classes.upgradesArea}>
            <UpgradesArea
              beerCount={beerCount}
              upgrades={upgrades}
              buyUpgrade={buyUpgrade}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Main;
