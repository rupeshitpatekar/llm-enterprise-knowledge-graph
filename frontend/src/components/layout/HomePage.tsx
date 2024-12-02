import type { FC } from "react";
import { Box, useTheme } from "@mui/material";
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
  setOpen: (open: boolean) => void;
  setSnackbarMessage: (message: ApiResponse) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const HomePage: FC<HomePageProps> = ({
  setOpen,
  setSnackbarMessage,
  setIsAuthenticated,
}) => {
  const theme = useTheme();

  const handleSignout = () => {
    localStorage.clear();
    setIsAuthenticated(ptTokenValidityCheck());
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

      <Footer />
    </Box>
  );
};

export default HomePage;
