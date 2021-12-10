import { Theme } from "@mui/material/styles";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Main from "./components/Main";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100vh",
      padding: `0 ${theme.spacing(2)}`,
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
