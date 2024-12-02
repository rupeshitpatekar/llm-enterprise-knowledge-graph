import { Typography, useTheme, Box, Stack, alpha } from "@mui/material";
import type { FC } from "react";

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
          Neural Quarter
        </Typography>
        <Typography
          key="IMPS_header"
          variant="caption"
          gutterBottom
          align="center"
          color={theme.palette.primary.contrastText}
        >
          Enterprise Knwoledge Graph
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;
