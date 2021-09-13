import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Main from "./components/Main";

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
      <Main />
    </div>
  );
}

export default App;
