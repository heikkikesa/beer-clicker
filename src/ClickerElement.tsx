import { useCallback, useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import beerImage from "./images/beer.svg";
import coinImage from "./images/money.svg";
import homeBrewImage from "./images/cooking.svg";
import brewSystemImage from "./images/brewing.svg";
import employeeImage from "./images/brewer.svg";
import microBreweryImage from "./images/brewery.svg";
import plantImage from "./images/factory.svg";
import farmingImage from "./images/farm-house.svg";

enum AssetStatus {
  Unavailable,
  Available,
  Purchased,
}

interface Asset {
  id: string;
  name: string;
  bpc: number;
  bps: number;
  amount: number;
  price: number;
  image: string;
  status: AssetStatus;
}

interface Assets {
  [index: string]: Asset;
}

const initialAssets: Assets = {
  homebrew: {
    id: "homebrew",
    name: "Homebrew kit",
    bpc: 1,
    bps: 0.1,
    amount: 0,
    price: 25,
    image: homeBrewImage,
    status: AssetStatus.Available,
  },
  brewsystem: {
    id: "brewsystem",
    name: "All-In-One brewing system",
    bpc: 5,
    bps: 0.5,
    amount: 0,
    price: 450,
    image: brewSystemImage,
    status: AssetStatus.Unavailable,
  },
  employee: {
    id: "employee",
    name: "Employee",
    bpc: 6,
    bps: 1,
    amount: 0,
    price: 2500,
    image: employeeImage,
    status: AssetStatus.Unavailable,
  },
  microbrewery: {
    id: "microbrewery",
    name: "Microbrewery",
    bpc: 20,
    bps: 4,
    amount: 0,
    price: 20000,
    image: microBreweryImage,
    status: AssetStatus.Unavailable,
  },
  plant: {
    id: "plant",
    name: "Brewing plant",
    bpc: 80,
    bps: 25,
    amount: 0,
    price: 245000,
    image: plantImage,
    status: AssetStatus.Unavailable,
  },
  farm: {
    id: "farm",
    name: "Farm",
    bpc: 240,
    bps: 48,
    amount: 0,
    price: 750000,
    image: farmingImage,
    status: AssetStatus.Unavailable,
  },
};

enum UpgradeStatus {
  Unavailable,
  Available,
  Active,
}

interface Upgrade {
  id: string;
  name: string;
  multiplier: number;
  price: number;
  availabilityRequirement: number;
  status: UpgradeStatus;
}

interface Upgrades {
  [assetId: string]: Upgrade[];
}

const initialUpgrades: Upgrades = {
  homebrew: [
    {
      id: "biggerKettle",
      multiplier: 1.5,
      price: 100,
      name: "Bigger kettle",
      availabilityRequirement: 3,
      status: UpgradeStatus.Unavailable,
    },
    {
      id: "biggerFermenter",
      multiplier: 1.5,
      price: 5000,
      name: "Bigger fermenter",
      availabilityRequirement: 40,
      status: UpgradeStatus.Unavailable,
    },
  ],
  brewsystem: [
    {
      id: "whirlpoolArm",
      multiplier: 1.5,
      price: 20000,
      name: "Whirlpool arm",
      availabilityRequirement: 10,
      status: UpgradeStatus.Unavailable,
    },
  ],
};

const PRICE_MULTIPLIER = 1.2;
const AUTOCLICKER_TRIGGER = "employee";
const UPDATE_INTERVAL = 100;
const bps_multiplier = 1000 / UPDATE_INTERVAL;

/*
  Plan:
  - grey out upgrades that can't be bought yet but are available
  - divide code into reasonable packages (React components into separate files, pure functions into own file or accompany the components)
  - show statistics and additional information about assets when hovering
  - general upgrades, like beer styles (not attached to any building, multiplies the final output)
  - autosave into local storage (every minute or something else?)
  - styling
*/

/*
  How to handle assets that can soon be bought?
  - if previous is bought, show the next?

  When purchasing asset -> update its status
    - available -> purchased (might not be necessary)
    If this is the first purchase
    - Iterate over the asset list and update the first item that has status of unavailable to available
    - stop iterating, as we only want to show one available item
    - unavailable -> available
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
    root: {
      flexGrow: 1,
    },
    beerImage: {
      width: 100,
      height: 100,
    },
    coin: {
      width: 20,
      height: 20,
    },
    assetList: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    upgradeList: {},
    clickerArea: {
      color: "#fff",
      textAlign: "center",
    },
    upgradesArea: {},
    assetsArea: {},
    assetIcon: {
      width: 100,
      height: 100,
    },
    assetTexts: {
      paddingLeft: theme.spacing(2),
      width: "50%",
    },
    assetAmount: {
      textAlign: "right",
      fontSize: 40,
    },
  })
);

const calculateBPC = (assets: Assets, upgrades: Upgrades): number => {
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
const calculateBPS = (assets: Assets, upgrades: Upgrades): number => {
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
const handleAvailableUpgrades = (
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

const handleActiveUpgrades = (
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
const handleAssetPurchaseStatuses = (
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

const ClickerElement = () => {
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
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={3} className={classes.clickerArea}>
          <div>Beers brewed: {Math.round(beerCount)}</div>
          <div>Beers-per-Click: {bpc}</div>
          {autoClickerEnabled && (
            <div>Beers-per-Second: {bps * bps_multiplier}</div>
          )}
          <img
            className={classes.beerImage}
            src={beerImage}
            alt="ebin"
            onClick={() => click()}
          />
        </Grid>
        <Grid item xs={3} className={classes.upgradesArea}>
          <List className={classes.upgradeList}>
            {Object.entries(upgrades).map(([assetId, assetUpgrades]) => (
              <ListItem key={`assetUpgrades-${assetId}`}>
                <List>
                  {assetUpgrades.map(
                    (upgrade) =>
                      upgrade.status === UpgradeStatus.Available && (
                        <ListItem
                          key={`upgrade-${upgrade.id}`}
                          onClick={() => buyUpgrade(upgrade, assetId)}
                        >
                          {upgrade.name}
                          {upgrade.status}
                        </ListItem>
                      )
                  )}
                </List>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={6} className={classes.assetsArea}>
          <List className={classes.assetList}>
            {Object.values(assets).map(
              (asset) =>
                (asset.status === AssetStatus.Available ||
                  asset.status === AssetStatus.Purchased) && (
                  <ListItem
                    onClick={() => buyAsset(assets[asset.id])}
                    key={asset.id}
                  >
                    <img className={classes.assetIcon} src={asset.image} />
                    <div className={classes.assetTexts}>
                      <p>{asset.name}</p>
                      {asset.price > beerCount && "Too expensive"}
                      <p>
                        <img src={coinImage} className={classes.coin} />
                        {asset.price}
                      </p>
                    </div>
                    <div className={classes.assetAmount}>{asset.amount}</div>
                  </ListItem>
                )
            )}
          </List>
        </Grid>
      </Grid>
    </div>
  );
};

export default ClickerElement;
