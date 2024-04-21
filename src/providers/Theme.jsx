import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#384094",
      contrastText: "#fff",
    },
    success: {
      main: "#00a600",
      contrastText: "#fff",
    },
    gray: {
      main: "#afafaf",
      contrastText: "#fff",
    },
    black: {
      main: "#515359",
      contrastText: "#fff",
    },
    white: {
      main: "#fff",
      contrastText: "#fff",
    },
    error: {
      main: "#d32f2f",
      contrastText: "#fff",
    },
    warning: {
      main: "#885990",
      contrastText: "#fff",
    },
  },
});

const Theme = (props) => {
  const { children } = props;

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
export default Theme;
