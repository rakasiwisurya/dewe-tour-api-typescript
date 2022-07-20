export const buildIncrementCode = (prefix: string | undefined, data: string) => {
  return `${prefix}${String(+data.substring(5) + 1).padStart(5, "0")}`;
};
