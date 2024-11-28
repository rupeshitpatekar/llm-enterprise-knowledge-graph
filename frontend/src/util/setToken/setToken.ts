import { AssistantLoginApiRes } from "@/types";
import { AESEncrypt } from "../AESEncrypt";

export const setToken = (jtoken: AssistantLoginApiRes): void => {
  const secret = AESEncrypt(jtoken.token);
  localStorage.setItem("ptToken", secret);
};
