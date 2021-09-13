import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import beerImage from "../images/beer.svg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    beerImage: {
      width: 100,
      height: 100,
    },
  })
);

type ClickerAreaProps = {
  beerCount: number;
  bpc: number;
  bps: number;
  autoClickerEnabled: boolean;
  bps_multiplier: number;
  click: Function;
};

const ClickerArea = ({
  beerCount,
  bpc,
  bps,
  autoClickerEnabled,
  bps_multiplier,
  click,
}: ClickerAreaProps) => {
  const classes = useStyles();

  return (
    <>
      <div>Beers brewed: {Math.round(beerCount)}</div>
      <div>Beers-per-Click: {bpc}</div>
      {autoClickerEnabled && (
        <div>Beers-per-Second: {bps * bps_multiplier}</div>
      )}
      <img
        className={classes.beerImage}
        src={beerImage}
        alt="ebin"
        onClick={() => click()}
      />
    </>
  );
};

export default ClickerArea;
