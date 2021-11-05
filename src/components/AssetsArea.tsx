import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import classNames from "classnames";
import { Assets, AssetStatus } from "../items/assets";
import coinImage from "../images/money.svg";
import { Upgrades, UpgradeStatus } from "../items/upgrades";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    assetList: {
      //backgroundColor: theme.palette.background.paper,
      //color: theme.palette.text.primary,
    },
    assetItem: {
      //marginBottom: theme.spacing(2),
      userSelect: "none",
    },
    assetPaper: {
      padding: theme.spacing(2),
      margin: "auto",
      position: "relative",
      cursor: "pointer",
      /*
      "&:hover": {
        boxShadow: theme.shadows[6],
      },
      */
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
    assetTexts: {
      //paddingLeft: theme.spacing(2),
      //width: "50%",
    },
    assetName: {
      fontWeight: theme.typography.fontWeightBold,
    },
    assetDescription: {
      fontStyle: "italic",
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
      //fontSize: "1.2rem",
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
  assets: Assets;
  upgrades: Upgrades;
  buyAsset: Function;
  buyUpgrade: Function;
};

const AssetsArea = ({
  beerCount,
  assets,
  upgrades,
  buyAsset,
  buyUpgrade,
}: AssetProps) => {
  const classes = useStyles();

  return (
    <Grid container spacing={3} className={classes.assetList}>
      {Object.values(assets).map(
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
                    <div
                      className={classNames(classes.assetPrice, {
                        disabled: asset.price > beerCount,
                      })}
                    >
                      <img src={coinImage} className={classes.coin} />
                      {asset.price}
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
              {Object.entries(upgrades).map(
                ([assetId, assetUpgrades]) =>
                  assetId === asset.id && (
                    <div className={classes.upgradeList}>
                      {assetUpgrades.map(
                        (upgrade) =>
                          upgrade.status === UpgradeStatus.Available && (
                            <div
                              key={`upgrade-${upgrade.id}`}
                              onClick={() => buyUpgrade(upgrade, assetId)}
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
                                {upgrade.price}
                              </div>
                              {upgrade.price > beerCount && (
                                <div className={classes.disabledOverlay}></div>
                              )}
                            </div>
                          )
                      )}
                    </div>
                  )
              )}
            </Grid>
          )
      )}
    </Grid>
  );
};

export default AssetsArea;
