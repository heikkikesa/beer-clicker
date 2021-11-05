import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import classNames from "classnames";
import { Assets, AssetStatus } from "../items/assets";
import coinImage from "../images/money.svg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    assetList: {
      //backgroundColor: theme.palette.background.paper,
      //color: theme.palette.text.primary,
    },
    assetItem: {
      //marginBottom: theme.spacing(2),
    },
    assetPaper: {
      padding: theme.spacing(2),
      margin: "auto",
      position: "relative",
      cursor: "pointer",
      "&:hover": {
        boxShadow: theme.shadows[6],
      },
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.contrastText,
    },
    disabledOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
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
    assetName: {},
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
  })
);

type AssetProps = {
  beerCount: number;
  assets: Assets;
  buyAsset: Function;
};

const AssetsArea = ({ beerCount, assets, buyAsset }: AssetProps) => {
  const classes = useStyles();

  return (
    <Grid container spacing={3} className={classes.assetList}>
      {Object.values(assets).map(
        (asset) =>
          (asset.status === AssetStatus.Available ||
            asset.status === AssetStatus.Purchased) && (
            <Grid
              item
              xs={6}
              onClick={() => buyAsset(assets[asset.id])}
              key={asset.id}
              className={classes.assetItem}
            >
              <Paper className={classes.assetPaper}>
                <Grid container spacing={3}>
                  <Grid item xs={2} className={classes.imageWrapper}>
                    <img className={classes.assetImage} src={asset.image} />
                  </Grid>
                  <Grid item xs={8}>
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
                  <Grid item xs={2} className={classes.amountWrapper}>
                    <div className={classes.assetAmount}>{asset.amount}</div>
                  </Grid>
                </Grid>
                {asset.price > beerCount && (
                  <div className={classes.disabledOverlay}></div>
                )}
              </Paper>
            </Grid>
          )
      )}
    </Grid>
  );
};

export default AssetsArea;
