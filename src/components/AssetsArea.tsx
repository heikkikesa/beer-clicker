import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Assets, AssetStatus } from "../items/assets";
import coinImage from "../images/money.svg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    assetList: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
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
    coin: {
      width: 20,
      height: 20,
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
    <List className={classes.assetList}>
      {Object.values(assets).map(
        (asset) =>
          (asset.status === AssetStatus.Available ||
            asset.status === AssetStatus.Purchased) && (
            <ListItem onClick={() => buyAsset(assets[asset.id])} key={asset.id}>
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
  );
};

export default AssetsArea;
