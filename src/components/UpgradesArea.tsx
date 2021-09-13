import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Upgrades, UpgradeStatus } from "../items/upgrades";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    upgradeList: {},
  })
);

type UpgradeProps = {
  beerCount: number;
  upgrades: Upgrades;
  buyUpgrade: Function;
};

const UpgradesArea = ({ beerCount, upgrades, buyUpgrade }: UpgradeProps) => {
  const classes = useStyles();

  return (
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
                    {upgrade.price > beerCount && "Too expensive"}
                  </ListItem>
                )
            )}
          </List>
        </ListItem>
      ))}
    </List>
  );
};

export default UpgradesArea;
