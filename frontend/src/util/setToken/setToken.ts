import { AssistantLoginApiRes } from "@/types";

export const setToken = (jtoken: AssistantLoginApiRes): void => {
  localStorage.setItem("impsToken", jtoken.token);
};
