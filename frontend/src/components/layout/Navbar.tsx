import type { FC } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  useTheme,
  Button,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Logo = new URL("./logo.png", import.meta.url).href;

interface NavbarProps {
  signout: () => void;
}

const Navbar: FC<NavbarProps> = ({ signout }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const mediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <AppBar id="header" position="static">
      <Toolbar
        sx={{ minHeight: "3rem !important", maxHeight: "3rem !important" }}
      >
        <Box component="div" sx={{ flexGrow: 1, boxSizing: "unset" }}>
          <IconButton
            id="navigate-to-action"
            color="inherit"
            disableRipple
            onClick={() => navigate("/")}
            sx={{ alignItems: "center" }}
          >
            <Box
              component="img"
              sx={{
                height: 35,
                width: 35,
                borderRadius: "50%",
                bgcolor: theme.palette.background.paper,
                color: theme.palette.background.paper,
              }}
              src={Logo}
              alt="IMP&S Logo"
            />
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
              spacing={0}
            >
              <Typography
                id="app-title"
                variant={mediumScreen ? "h5" : "h6"}
                paddingLeft={1}
                sx={{
                  lineHeight: "1.25rem",
                }}
              >
                Enterprise
              </Typography>
              <Typography
                key="IMPS_header"
                variant="body2"
                sx={{
                  lineHeight: "1.25rem",
                }}
                paddingLeft={1.1}
                letterSpacing={2}
              >
                Knowledge Graph
              </Typography>
            </Stack>
          </IconButton>
        </Box>
        <Button
          variant="outlined"
          onClick={() => signout()}
          startIcon={<LogoutOutlined />}
          size="small"
          sx={{ color: theme.palette.common.white }}
        >
          Sign out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
