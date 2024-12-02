export const getToken = (): string => {
  const token = localStorage.getItem("impsToken");
  return token ? token : "";
};
