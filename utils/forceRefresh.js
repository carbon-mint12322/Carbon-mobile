let forceRefresh = false;

export const setForceRefresh = (value) => {
  forceRefresh = value;
};

export const getForceRefresh = () => {
  return forceRefresh;
};