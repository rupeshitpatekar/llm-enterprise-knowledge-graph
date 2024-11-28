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

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserAuthentication } from "../types";
import { INITIAL_ROOT_STATE } from "@/constants";

const devAssistantInitialState: UserAuthentication = INITIAL_ROOT_STATE;

export const rootSlice = createSlice({
  name: "root",
  initialState: devAssistantInitialState,
  reducers: {
    setPermissions: (_, authState: PayloadAction<UserAuthentication>) => ({
      ...authState.payload,
    }),
  },
});

export const { setPermissions } = rootSlice.actions;
export default rootSlice.reducer;
