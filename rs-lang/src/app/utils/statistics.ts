export const isToday = (checkDate: Date) => {
  const today = new Date();
  return checkDate.getDate() === today.getDate()
  && checkDate.getMonth() === today.getMonth()
  && checkDate.getFullYear() === today.getFullYear();
};
