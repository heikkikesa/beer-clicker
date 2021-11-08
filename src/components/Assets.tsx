import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import classNames from "classnames";
import {
  Asset,
  AssetData,
  Assets,
  AssetStatus,
  allAssets,
} from "../items/assets";
import coinImage from "../images/money.svg";
import {
  allUpgrades,
  Upgrade,
  UpgradeData,
  Upgrades,
  UpgradeStatus,
} from "../items/upgrades";
import { bps_multiplier } from "./Main";
import { formatLongNumber } from "../helpers/functions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    assetList: {},
    assetItem: {
      userSelect: "none",
    },
    assetPaper: {
      padding: theme.spacing(2),
      margin: "auto",
      position: "relative",
      cursor: "pointer",
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.contrastText,
      zIndex: 10,
      transitionDuration: ".05s",
      "&:active": {
        transform: "scale(.98)",
      },
    },
    disabledOverlay: {
      position: "absolute",
      pointerEvents: "none",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      borderRadius: theme.shape.borderRadius,
    },
    imageWrapper: {
      display: "flex",
    },
    assetImage: {
      maxWidth: "100%",
      maxHeight: "100%",
    },
    assetTexts: {},
    assetName: {
      fontWeight: theme.typography.fontWeightBold,
    },
    assetDescription: {
      fontStyle: "italic",
    },
    assetStats: {
      [theme.breakpoints.up("md")]: {
        height: "1rem",
      },
      marginBottom: "1rem",
      color: theme.palette.grey[600],
    },
    assetPrice: {
      display: "flex",
      alignItems: "center",
      "&.disabled": {
        color: "#f00",
      },
    },
    coin: {
      width: 20,
      height: 20,
      paddingRight: theme.spacing(1),
    },
    amountWrapper: {
      display: "flex",
      alignItems: "center",
    },
    assetAmount: {
      textAlign: "right",
      fontSize: 40,
      width: "100%",
    },
    upgradeList: {
      backgroundColor: theme.palette.primary.main,
      marginTop: -theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.common.black,
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingBottom: 1,
      width: "96%",
      marginLeft: "auto",
      marginRight: "auto",
      zIndex: 0,
    },
    upgradeWrapper: {
      position: "relative",
      display: "flex",
      justifyContent: "space-between",
      gap: "1rem",
      paddingBottom: theme.spacing(1),
      backgroundColor: theme.palette.common.white,
      marginBottom: theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(1),
      cursor: "pointer",
      transitionDuration: ".05s",
      "&:active": {
        transform: "scale(.98)",
      },
    },
    upgradeContent: {},
    upgradeName: {
      fontWeight: theme.typography.fontWeightBold,
      margin: 0,
    },
    upgradeDescription: {
      fontStyle: "italic",
      margin: 0,
    },
    upgradePrice: {
      display: "flex",
      alignItems: "center",
      "&.disabled": {
        color: "#f00",
      },
    },
  })
);

type AssetProps = {
  beerCount: number;
  totalBPS: number;
  autoClickerEnabled: boolean;
  assets: Assets;
  upgrades: Upgrades;
  buyAsset: Function;
  buyUpgrade: Function;
};

interface RichAsset extends Asset, AssetData {}

interface RichUpgrade extends Upgrade, UpgradeData {}
interface RichUpgrades {
  [assetId: string]: RichUpgrade[];
}

const AssetsComponent = ({
  beerCount,
  totalBPS,
  autoClickerEnabled,
  assets,
  upgrades,
  buyAsset,
  buyUpgrade,
}: AssetProps) => {
  const classes = useStyles();

  // combine the values from available assets and asset data
  const richAssets: RichAsset[] = Object.values(allAssets).map((assetData) => {
    const ownedAsset = assets[assetData.id];
    const asset: RichAsset = {
      id: assetData.id,
      amount: ownedAsset !== undefined ? ownedAsset.amount : 0,
      price:
        ownedAsset !== undefined ? ownedAsset.price : assetData.initialPrice,
      bps: ownedAsset !== undefined ? ownedAsset.bps : 0,
      bpc: ownedAsset !== undefined ? ownedAsset.bpc : 0,
      status:
        ownedAsset !== undefined ? ownedAsset.status : AssetStatus.Unavailable,
      name: assetData.name,
      description: assetData.description,
      bpcCoefficient: assetData.bpcCoefficient,
      bpsCoefficient: assetData.bpsCoefficient,
      initialPrice: assetData.initialPrice,
      image: assetData.image,
    };
    return asset;
  });

  // combine the values from available upgrades and upgrade data
  const richUpgrades: RichUpgrades = Object.fromEntries(
    Object.entries(allUpgrades).map(([assetId, assetUpgrades]) => {
      const ownedUpgrades = upgrades[assetId];
      const richAssetUpgrades = assetUpgrades.map((upgradeData) => {
        const ownedUpgrade =
          ownedUpgrades !== undefined
            ? ownedUpgrades.find((owned) => owned.id === upgradeData.id)
            : undefined;
        const upgrade: RichUpgrade = {
          id: upgradeData.id,
          status:
            ownedUpgrade !== undefined
              ? ownedUpgrade.status
              : UpgradeStatus.Unavailable,
          name: upgradeData.name,
          description: upgradeData.description,
          multiplier: upgradeData.multiplier,
          price: upgradeData.price,
          availabilityRequirement: upgradeData.availabilityRequirement,
        };
        return upgrade;
      });
      return [assetId, richAssetUpgrades];
    })
  );

  const bps = totalBPS === 0 ? 1 : totalBPS;

  return (
    <Grid container spacing={3} className={classes.assetList}>
      {richAssets.map(
        (asset) =>
          (asset.status === AssetStatus.Available ||
            asset.status === AssetStatus.Purchased) && (
            <Grid
              item
              xs={12}
              md={6}
              key={asset.id}
              className={classes.assetItem}
            >
              <Paper
                className={classes.assetPaper}
                onClick={() => buyAsset(assets[asset.id])}
              >
                <Grid container spacing={3}>
                  <Grid item xs={3} md={2} className={classes.imageWrapper}>
                    <img className={classes.assetImage} src={asset.image} />
                  </Grid>
                  <Grid item xs={6} md={8}>
                    <div className={classes.assetTexts}>
                      <p className={classes.assetName}>{asset.name}</p>
                      <p className={classes.assetDescription}>
                        {asset.description}
                      </p>
                    </div>
                    <div className={classes.assetStats}>
                      {autoClickerEnabled &&
                        asset.status === AssetStatus.Purchased && (
                          <div>
                            {formatLongNumber(
                              Math.round(asset.bps * bps_multiplier)
                            )}{" "}
                            per second ({((asset.bps / bps) * 100).toFixed(2)}%
                            of total)
                          </div>
                        )}
                    </div>
                    <div
                      className={classNames(classes.assetPrice, {
                        disabled: asset.price > beerCount,
                      })}
                    >
                      <img src={coinImage} className={classes.coin} />
                      {formatLongNumber(asset.price)}
                    </div>
                  </Grid>
                  <Grid item xs={3} md={2} className={classes.amountWrapper}>
                    <div className={classes.assetAmount}>{asset.amount}</div>
                  </Grid>
                </Grid>
                {asset.price > beerCount && (
                  <div className={classes.disabledOverlay}></div>
                )}
              </Paper>
              <div className={classes.upgradeList}>
                {richUpgrades[asset.id].map(
                  (upgrade) =>
                    upgrade.status === UpgradeStatus.Available && (
                      <div
                        key={`upgrade-${upgrade.id}`}
                        onClick={() => buyUpgrade(upgrade, asset.id)}
                        className={classes.upgradeWrapper}
                      >
                        <div className={classes.upgradeContent}>
                          <p className={classes.upgradeName}>{upgrade.name}</p>
                          <p className={classes.upgradeDescription}>
                            {upgrade.description}
                          </p>
                        </div>
                        <div
                          className={classNames(classes.upgradePrice, {
                            disabled: upgrade.price > beerCount,
                          })}
                        >
                          <img src={coinImage} className={classes.coin} />
                          {formatLongNumber(upgrade.price)}
                        </div>
                        {upgrade.price > beerCount && (
                          <div className={classes.disabledOverlay}></div>
                        )}
                      </div>
                    )
                )}
              </div>
            </Grid>
          )
      )}
    </Grid>
  );
};

export default AssetsComponent;
