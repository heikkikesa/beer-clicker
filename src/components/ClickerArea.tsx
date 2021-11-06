import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import beerImage from "../images/beer.svg";
import { bps_multiplier } from "./Main";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    beerImageContainer: {
      padding: theme.spacing(2),
      userSelect: "none",
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

type ClickerAreaProps = {
  beerCount: number;
  bpc: number;
  bps: number;
  autoClickerEnabled: boolean;
  click: Function;
};

const ClickerArea = ({
  beerCount,
  bpc,
  bps,
  autoClickerEnabled,
  click,
}: ClickerAreaProps) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.total}>{Math.round(beerCount)}</div>
      <div className={classes.beerImageContainer}>
        <img
          className={classes.beerImage}
          src={beerImage}
          alt="ebin"
          onClick={() => click()}
        />
      </div>
      {/*<div>Beers-per-Click: {bpc}</div>*/}
      {autoClickerEnabled && (
        <div className={classes.perSecond}>
          {Math.round(bps * bps_multiplier)} per second
        </div>
      )}
    </>
  );
};

export default ClickerArea;
