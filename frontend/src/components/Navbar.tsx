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

const Logo = new URL("./meera.png", import.meta.url).href;

interface NavbarProps {
  signout: () => void;
  handleNewChat: () => void;
}

const Navbar: FC<NavbarProps> = ({ signout, handleNewChat }) => {
  const theme = useTheme();
  const mediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <AppBar
      id="header"
      position="static"
      sx={{ backgroundColor: theme.palette.background.default, boxShadow: 0 }}
    >
      <Toolbar
        sx={{ minHeight: "3rem !important", maxHeight: "3rem !important" }}
      >
        <Box component="div" sx={{ flexGrow: 1, boxSizing: "unset" }}>
          <IconButton
            id="navigate-to-action"
            color="inherit"
            disableRipple
            onClick={handleNewChat}
            sx={{ alignItems: "end" }}
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
                  color: theme.palette.primary.main,
                  lineHeight: "1.25rem",
                }}
              >
                IMPS
              </Typography>
              <Typography
                key="IMPS_header"
                variant="body2"
                sx={{
                  color: theme.palette.common.black,
                  fontSize: "0.75rem",
                }}
                paddingLeft={1.1}
                letterSpacing={2}
              >
                FRAMEWORK
              </Typography>
            </Stack>
          </IconButton>
        </Box>
        <Button
          variant="contained"
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
