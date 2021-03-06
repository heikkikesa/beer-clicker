import classNames from "classnames";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
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
    header: {
      padding: "1rem",
      textAlign: "center",
    },
    title: {
      fontFamily: "Vollkorn,serif",
      fontSize: "2.25rem",
      color: theme.palette.primary.main,
    },
    description: {},
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
    upgradeIndicators: {
      display: "flex",
      position: "absolute",
      right: "0.5rem",
      top: "0.5rem",
      gap: "0.25rem",
    },
    upgradeIndicator: {
      height: 10,
      width: 10,
      backgroundColor: theme.palette.primary.main,
      borderRadius: "50%",
    },
    imageWrapper: {
      display: "flex",
    },
    assetImage: {
      maxWidth: "100%",
      maxHeight: "100%",
    },
    assetTexts: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    assetName: {
      fontWeight: "bold",
    },
    assetDescription: {
      fontStyle: "italic",
    },
    assetStats: {
      [theme.breakpoints.up("md")]: {
        minHeight: "1.5rem",
        paddingRight: theme.spacing(1),
      },
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
    price: {
      marginTop: 2,
    },
    amountWrapper: {
      display: "flex",
      alignItems: "center",
      [theme.breakpoints.up("md")]: {
        paddingLeft: "0!important",
      },
    },
    assetAmount: {
      textAlign: "right",
      fontSize: 40,
      width: "100%",
    },
    upgradeList: {
      backgroundColor: theme.palette.primary.main,
      marginTop: theme.spacing(-1),
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
      "&.disabled": {
        backgroundColor: theme.palette.primary.dark,
      },
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
      fontWeight: "bold",
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
    <div>
      <div className={classes.header}>
        <div className={classes.title}>Upgrades</div>
      </div>
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
                  <div className={classes.upgradeIndicators}>
                    {richUpgrades[asset.id].map(
                      (upgrade, key) =>
                        upgrade.status === UpgradeStatus.Active && (
                          <div
                            className={classes.upgradeIndicator}
                            key={`upgrade-${asset.id}-${key}`}
                          ></div>
                        )
                    )}
                  </div>
                  <Grid container spacing={3}>
                    <Grid item xs={3} md={2} className={classes.imageWrapper}>
                      <img className={classes.assetImage} src={asset.image} />
                    </Grid>
                    <Grid item xs={6} md={8} className={classes.assetTexts}>
                      <div className={classes.assetName}>{asset.name}</div>
                      <div className={classes.assetDescription}>
                        {asset.description}
                      </div>
                      <div className={classes.assetStats}>
                        {autoClickerEnabled &&
                          asset.status === AssetStatus.Purchased && (
                            <div>
                              {formatLongNumber(
                                Math.round(
                                  (asset.bps * bps_multiplier) / asset.amount
                                )
                              )}{" "}
                              per one ({((asset.bps / bps) * 100).toFixed(2)}%
                              of total / second)
                            </div>
                          )}
                      </div>
                      <div
                        className={classNames(classes.assetPrice, {
                          disabled: asset.price > beerCount,
                        })}
                      >
                        <img src={coinImage} className={classes.coin} />
                        <div className={classes.price}>
                          {formatLongNumber(asset.price)}
                        </div>
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
                <div
                  className={classNames(classes.upgradeList, {
                    disabled: asset.price > beerCount,
                  })}
                >
                  {richUpgrades[asset.id].map(
                    (upgrade) =>
                      upgrade.status === UpgradeStatus.Available && (
                        <div
                          key={`upgrade-${upgrade.id}`}
                          onClick={() => buyUpgrade(upgrade, asset.id)}
                          className={classes.upgradeWrapper}
                        >
                          <div className={classes.upgradeContent}>
                            <p className={classes.upgradeName}>
                              {upgrade.name}
                            </p>
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
                            <div className={classes.price}>
                              {formatLongNumber(upgrade.price)}
                            </div>
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
    </div>
  );
};

export default AssetsComponent;
