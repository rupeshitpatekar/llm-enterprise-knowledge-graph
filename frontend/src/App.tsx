import type { FC, SyntheticEvent } from "react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateWrapper from "./routes/PrivateWrapper";

import { ptTokenValidityCheck } from "./util";
import { HomePage, LandingPage } from "./components";
import { Alert, Snackbar, SnackbarCloseReason, useTheme } from "@mui/material";
import { ApiResponse } from "./types";

interface AppProps {}

const App: FC<AppProps> = () => {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [snakbarMessage, setSnackbarMessage] = useState<ApiResponse>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    ptTokenValidityCheck()
  );

  const handleSnackbarClose = (
    _event?: SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Routes>
        <Route element={<PrivateWrapper isAuth={isAuthenticated} />}>
          <Route
            path="*"
            element={
              <HomePage
                setOpen={setOpen}
                setSnackbarMessage={setSnackbarMessage}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
        </Route>
        <Route
          path="/"
          Component={() =>
            isAuthenticated ? (
              <HomePage
                setOpen={setOpen}
                setSnackbarMessage={setSnackbarMessage}
                setIsAuthenticated={setIsAuthenticated}
              />
            ) : (
              <LandingPage
                setOpen={setOpen}
                setSnackbarMessage={setSnackbarMessage}
                setIsAuthenticated={setIsAuthenticated}
              />
            )
          }
        />
      </Routes>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snakbarMessage?.type}
          variant="filled"
          sx={{ width: "100%", color: theme.palette.common.white }}
        >
          {snakbarMessage?.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default App;
