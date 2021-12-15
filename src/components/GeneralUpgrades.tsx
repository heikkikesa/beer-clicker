import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import classNames from "classnames";
import { formatLongNumber } from "../helpers/functions";
import {
  allGeneralUpgrades,
  GeneralUpgrade,
  GeneralUpgradeData,
} from "../items/generalUpgrades";
import coinImage from "../images/money.svg";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionDetails } from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      padding: "1rem",
    },
    header: {
      padding: "1rem",
      margin: "1rem 0",
      textAlign: "center",
    },
    title: {
      fontFamily: "Vollkorn,serif",
      fontSize: "2.25rem",
      color: theme.palette.primary.main,
    },
    description: {},
    accordion: {
      borderRadius: theme.shape.borderRadius,
      "&:before": {
        display: "none",
      },
    },
    accordionTitle: {
      "&.available": {
        color: theme.palette.primary.main,
        fontWeight: "bold",
      },
    },
    upgradesWrapper: {
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
      justifyContent: "center",
      marginTop: "1rem",
    },
    upgrade: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      userSelect: "none",
      position: "relative",
      padding: "0.5rem",
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.contrastText,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[1],
      cursor: "pointer",
      transitionDuration: ".05s",
      "&:active": {
        transform: "scale(.98)",
      },
      "&.owned": {
        backgroundColor: "transparent",
        color: theme.palette.primary.main,
        boxShadow: "none",
        cursor: "default",
        transform: "none",
        "& $upgradePrice": {
          display: "none",
        },
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
    upgradeName: {
      fontWeight: "bold",
    },
    upgradePrice: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&.disabled": {
        color: "#f00",
      },
    },
    coin: {
      width: 20,
      height: 20,
      paddingRight: theme.spacing(1),
    },
  })
);

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
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const classes = useStyles();
  const theme = useTheme() as Theme;

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

  useEffect(() => {
    if (window.innerWidth >= theme.breakpoints.values.md) {
      // don't show expanded accordion on mobile by default
      setIsExpanded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upgradesAvailable = richGeneralUpgrades.some(
    (upgrade) => !upgrade.active && upgrade.price < beerCount
  );
  const accordionTitle = upgradesAvailable
    ? "New styles available!"
    : "No new styles available";

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <div className={classes.title}>Beer Styles</div>
        <div className={classes.description}>
          Each style improves profits by 10%
        </div>
      </div>
      <Accordion
        square={false}
        expanded={isExpanded}
        onChange={() => setIsExpanded(!isExpanded)}
        className={classes.accordion}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div
            className={classNames(classes.accordionTitle, {
              available: upgradesAvailable,
            })}
          >
            {accordionTitle}
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.upgradesWrapper}>
            {richGeneralUpgrades.map((upgrade) => (
              <div
                className={classNames(classes.upgrade, {
                  owned: upgrade.active,
                })}
                key={`general-upgrade-${upgrade.id}`}
                onClick={() => buyGeneralUpgrade(upgrade.id)}
              >
                <div className={classes.upgradeName}>{upgrade.name}</div>
                <div
                  className={classNames(classes.upgradePrice, {
                    disabled: !upgrade.active && upgrade.price > beerCount,
                  })}
                >
                  <img src={coinImage} className={classes.coin} />
                  {formatLongNumber(upgrade.price)}
                </div>
                {!upgrade.active && upgrade.price > beerCount && (
                  <div className={classes.disabledOverlay}></div>
                )}
              </div>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default GeneralUpgradesComponent;
