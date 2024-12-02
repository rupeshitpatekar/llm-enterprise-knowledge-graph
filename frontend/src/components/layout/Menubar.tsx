import { Stack, Button, useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import type { FC } from "react";

interface MenubarProps {}

const Menubar: FC<MenubarProps> = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Create node", path: "/create-node" },
    { label: "Update node", path: "/update-node" },
    { label: "Generate content", path: "/query-node" },
  ];

  const getButtonStyle = (path: string) => ({
    textDecoration: "none",
    color:
      location.pathname === path
        ? theme.palette.primary.main
        : theme.palette.text.secondary,
    ":hover": { backgroundColor: "transparent" },
  });

  return (
    <Stack
      direction="row"
      spacing={{ md: 2, xs: 1 }}
      px={{ md: 3, xs: 0 }}
      py={1}
      bgcolor={theme.palette.background.paper}
    >
      {menuItems.map(({ label, path }) => (
        <Button
          key={path}
          onClick={() => navigate(path)}
          disableRipple
          variant={location.pathname === path ? "outlined" : "text"}
          sx={getButtonStyle(path)}
        >
          {label}
        </Button>
      ))}
    </Stack>
  );
};

export default Menubar;
