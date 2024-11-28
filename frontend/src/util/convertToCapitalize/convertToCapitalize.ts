export const convertToCapitalize = <T extends string>(
  text: T
): Capitalize<T> => {
  return (text.charAt(0).toUpperCase() + text.slice(1)) as Capitalize<T>;
};
