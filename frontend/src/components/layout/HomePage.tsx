import type { FC, SyntheticEvent } from "react";
import { useState } from "react";
import {
  Alert,
  Box,
  Snackbar,
  SnackbarCloseReason,
  useTheme,
} from "@mui/material";
import { ptTokenValidityCheck } from "@/util";
import type { ApiResponse } from "@/types";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Menubar from "./Menubar";
import { Route, Routes } from "react-router-dom";
import NodeStructure from "../NodeStructure";
import CreateNode from "../CreateNode";
import QueryNode from "../QueryNode";
import { treeData } from "../data";
import UpdateNode from "../UpdateNode";

interface HomePageProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const HomePage: FC<HomePageProps> = ({ setIsAuthenticated }) => {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [snakbarMessage, setSnackbarMessage] = useState<ApiResponse>();

  console.log(setSnackbarMessage);

  const handleSignout = () => {
    localStorage.clear();
    setIsAuthenticated(ptTokenValidityCheck());
  };

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
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      bgcolor={theme.palette.background.default}
    >
      <Navbar signout={handleSignout} />
      <Menubar />
      <Box flexGrow={1} mx={4} my={2}>
        <Routes>
          <Route
            path="/create-node"
            element={
              <CreateNode
                setOpen={setOpen}
                setSnackbarMessage={setSnackbarMessage}
              />
            }
          />
          <Route path="/update-node" element={<UpdateNode />} />
          <Route path="/query-node" element={<QueryNode />} />
          <Route path="/" element={<NodeStructure data={treeData} />} />
        </Routes>
      </Box>
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
      <Footer />
    </Box>
  );
};

export default HomePage;
