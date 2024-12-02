import moment from "moment";
import { getToken } from "../getToken";
import jwtDecode from "jwt-decode";
import type { JWTDecodeData } from "@/types";

export const ptTokenValidityCheck = () => {
  const token = getToken();
  if (!token) return false;
  const { exp } = jwtDecode<JWTDecodeData>(token);
  return moment(exp * 1000).diff(moment(), "minutes") >= 1;
};
