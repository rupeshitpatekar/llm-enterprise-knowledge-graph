import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { Provider } from "react-redux";
import { setupStore } from "./reducer/store";
import AppThemeProvider from "./AppThemeProvider";

const store = setupStore();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Suspense
      fallback={
        <Box className="custom-spinner">
          <CircularProgress size={75} />
        </Box>
      }
    >
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="*" element={<AppThemeProvider />} />
          </Routes>
        </Router>
      </Provider>
    </Suspense>
  </StrictMode>
);
