export const isToday = (checkDate: Date) => {
  const today = new Date();
  return checkDate.getDate() === today.getDate()
  && checkDate.getMonth() === today.getMonth()
  && checkDate.getFullYear() === today.getFullYear();
};

export const getUniqueWords = (main:string[], check:string[]) => {
  let result: string[] = [];
  check.forEach((item) => {
    if (main.includes(item) === false) result = [...result, item];
  });
  return result;
};
