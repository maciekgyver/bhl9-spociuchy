export const getCurrentDateDelayed = (delay: number) => {
  const currentDate = new Date(Date.now() + delay * 60000).getTime();
  return currentDate;
};
