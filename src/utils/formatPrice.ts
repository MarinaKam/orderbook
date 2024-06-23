export const formatPrice = (arg: number): string => {
  return arg.toLocaleString('en', { useGrouping: true })
};
