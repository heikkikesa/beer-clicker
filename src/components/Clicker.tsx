import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { formatLongNumber } from "../helpers/functions";
import beerImage from "../images/beer.svg";
import { bps_multiplier } from "./Main";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    beerImageContainer: {
      padding: theme.spacing(2),
      userSelect: "none",
      position: "relative",
    },
    beerImage: {
      width: 150,
      height: 150,
      cursor: "pointer",
      userDrag: "none",
      transitionDuration: ".05s",
      "&:active": {
        transform: "scale(.9)",
      },
    },
    clickCount: {
      display: "none",
    },
    total: {
      fontFamily: "Vollkorn,serif",
      fontSize: "3rem",
      color: theme.palette.primary.main,
      marginTop: "1rem",
    },
    perSecond: {
      fontSize: "1.2rem",
    },
  })
);

type ClickerProps = {
  beerCount: number;
  bpc: number;
  bps: number;
  autoClickerEnabled: boolean;
  click: Function;
  showTooltip: boolean;
};

const ClickerComponent = ({
  beerCount,
  bpc,
  bps,
  autoClickerEnabled,
  click,
  showTooltip,
}: ClickerProps) => {
  const classes = useStyles();
  const count = formatLongNumber(beerCount);

  return (
    <div>
      <div className={classes.total}>{count}</div>
      <div className={classes.beerImageContainer}>
        <div className={classes.clickCount}>{bpc}</div>
        <img
          className={classes.beerImage}
          src={beerImage}
          alt="beer"
          onClick={() => click()}
        />
      </div>
      {autoClickerEnabled && (
        <div className={classes.perSecond}>
          {Math.round(bps * bps_multiplier)} per second
        </div>
      )}
    </div>
  );
};

export default ClickerComponent;
