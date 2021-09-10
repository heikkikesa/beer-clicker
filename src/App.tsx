import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ClickerElement from "./ClickerElement";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#345",
      height: "100%",
      width: "100%",
      position: "absolute",
    },
  })
);

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ClickerElement />
    </div>
  );
}

export default App;
