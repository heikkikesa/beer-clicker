import React from "react";
import ReactDOM from "react-dom";
import { createTheme, StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffc107",
    },
    secondary: {
      main: "#64b5f6",
    },
    background: {
      default: "#303030",
      paper: "#424242",
    },
  },
  typography: {
    fontFamily: ["Open Sans", "sans-serif"].join(","),
  },
});

ReactDOM.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <App />
        </CssBaseline>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
