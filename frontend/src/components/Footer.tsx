/*
 * ============================================================================
 *
 * Copyright © CAPGEMINI ENGINEERING ACT S.A.S,  a Capgemini Group company. All Rights Reserved.
 *
 *
 * ============================================================================
 *
 * This software is the confidential & proprietary information of CAPGEMINI ENGINEERING ACT S.A.S. You shall not disclose such confidential information and shall use it only in accordance with the terms of the license agreement.
 *
 * ============================================================================
 */

import { Typography, useTheme, Box } from "@mui/material";
import type { FC } from "react";

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  const theme = useTheme();
  return (
    <Box
      id="footer"
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: theme.palette.background.default }}
      p="0.25rem 1rem"
    >
      <Typography variant="caption" color={theme.palette.text.secondary}>
        © 2024 Meera, Powered by IMPS Framework
      </Typography>
    </Box>
  );
};

export default Footer;
