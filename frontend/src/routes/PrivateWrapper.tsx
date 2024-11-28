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

import type { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface PrivateWrapperProps {
  isAuth: boolean;
}
const PrivateWrapper: FC<PrivateWrapperProps> = ({ isAuth }) => {
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateWrapper;
