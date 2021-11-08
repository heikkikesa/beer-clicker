import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { formatLongNumber } from "../helpers/functions";
import {
  allGeneralUpgrades,
  GeneralUpgrade,
  GeneralUpgradeData,
} from "../items/generalUpgrades";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

type GeneralUpgradesProps = {
  beerCount: number;
  generalUpgrades: GeneralUpgrade[];
  buyGeneralUpgrade: Function;
};

interface RichGeneralUpgrade extends GeneralUpgradeData, GeneralUpgrade {}

const GeneralUpgradesComponent = ({
  beerCount,
  generalUpgrades,
  buyGeneralUpgrade,
}: GeneralUpgradesProps) => {
  const classes = useStyles();

  //const count = formatLongNumber(beerCount);
  const richGeneralUpgrades: RichGeneralUpgrade[] = allGeneralUpgrades.map(
    (upgrade) => {
      const isActive = generalUpgrades.some(
        (generalUpgrade) => generalUpgrade.id === upgrade.id
      );
      const richUpgrade: RichGeneralUpgrade = {
        id: upgrade.id,
        name: upgrade.name,
        description: upgrade.description,
        price: upgrade.price,
        multiplier: upgrade.multiplier,
        active: isActive,
      };
      return richUpgrade;
    }
  );

  /*
    Prevent buying if already bought (active === true)
  */

  return (
    <>
      {richGeneralUpgrades.map((upgrade) => (
        <div
          key={`general-upgrade-${upgrade.id}`}
          onClick={() => buyGeneralUpgrade(upgrade.id)}
        >
          {upgrade.name} {formatLongNumber(upgrade.price)}
        </div>
      ))}
    </>
  );
};

export default GeneralUpgradesComponent;
