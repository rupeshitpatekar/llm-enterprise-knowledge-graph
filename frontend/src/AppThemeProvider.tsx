import type { FC } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import { DEFAULT_THEME } from "./theme";
import App from "./App";

interface AppThemeProviderProps {}

const AppThemeProvider: FC<AppThemeProviderProps> = () => {
  const appTheme = DEFAULT_THEME;

  const theme = createTheme({
    ...appTheme,
    components: {
      MuiButton: {
        styleOverrides: {
          sizeLarge: { fontSize: 18 },
          sizeMedium: { fontSize: 14 },
          sizeSmall: { fontSize: 12 },
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            backgroundColor: "#121621",
            border: "1px solid white",
            overflow: "hidden",
            borderRadius: 8,
            color: "white",
            "&.Mui-expanded": {
              backgroundColor: "white",
              color: "black",
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
};

export default AppThemeProvider;
