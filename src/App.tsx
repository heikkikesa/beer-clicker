import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Main from "./components/Main";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100vh",
      padding: `0 ${theme.spacing(2)}px`,
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
