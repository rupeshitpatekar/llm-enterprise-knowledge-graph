import { Typography, useTheme, Box, Stack, alpha } from "@mui/material";
import type { FC } from "react";
const IMPS_LOGO = new URL("./CG_logo.png", import.meta.url).href;
interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  const theme = useTheme();
  return (
    <Box>
      <Stack
        id="footer"
        direction={{ md: "row", sm: "column" }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.75) }}
        p="0.25rem 1rem"
      >
        <Typography
          variant="caption"
          color={theme.palette.primary.contrastText}
        >
          Enterprise Knwoledge Graph - Neural Quartet
        </Typography>
        <img
          alt="brand logo"
          src={IMPS_LOGO}
          style={{
            color: theme.palette.common.black,
            width: 140,
            height: 15,
          }}
        />
      </Stack>
    </Box>
  );
};

export default Footer;
