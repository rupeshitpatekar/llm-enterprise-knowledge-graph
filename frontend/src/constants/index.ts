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

import type { UserAuthentication } from "@/types";
import { Android, Memory, TravelExplore } from "@mui/icons-material";

export const INITIAL_ROOT_STATE: UserAuthentication = {
  user_id: "",
  exp: 0,
};

export const ERROR_ADMIN = "SNACKBAR_ERROR_ADMIN_MESSAGE";

export const WELCOME_PAGE_CARD_DATA = [
  {
    category: "Services",
    icon: Memory,
    questions: [
      "How to set up and use Service Discovery in IMPS using Eureka?",
      "How to Set Up API Gateway for IMPS Services Using Spring Cloud Gateway?",
      "How to create docker container for services?",
    ],
  },
  {
    category: "Web portal",
    icon: TravelExplore,
    questions: [
      "How to create a MicroFrontend?",
      "How to use the components of common micro-frontend in other modules?",
      "How does Redux Toolkit Query (RTK Query) manage token-based authorization?",
    ],
  },
  {
    category: "Mobile app",
    icon: Android,
    questions: [
      "How to add a new route/component in mobile app?",
      "How to create build of IMPS Mobile app for android?",
      "How to generate certificates for IMPS Mobile app (iOS only)?",
    ],
  },
];
