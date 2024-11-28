import { AESDecrypt } from "../AESDecrypt";

export const getToken = (): string => {
  const token = localStorage.getItem("ptToken");
  return token ? AESDecrypt(token) : "";
};
