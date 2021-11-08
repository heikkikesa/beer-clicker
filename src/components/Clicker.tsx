import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
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
};

const ClickerComponent = ({
  beerCount,
  bpc,
  bps,
  autoClickerEnabled,
  click,
}: ClickerProps) => {
  const classes = useStyles();

  const count = formatLongNumber(beerCount);

  return (
    <>
      <div className={classes.total}>{count}</div>
      <div className={classes.beerImageContainer}>
        <div className={classes.clickCount}>{bpc}</div>
        <img
          className={classes.beerImage}
          src={beerImage}
          alt="ebin"
          onClick={() => click()}
        />
      </div>
      {autoClickerEnabled && (
        <div className={classes.perSecond}>
          {Math.round(bps * bps_multiplier)} per second
        </div>
      )}
    </>
  );
};

export default ClickerComponent;
