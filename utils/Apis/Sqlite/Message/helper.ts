const normalizeTimestamp = (timestamp: number) => {
  return timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
};

const formatterDate = (date: number) => {
  let _date = new Date(normalizeTimestamp(date));
  const year = _date.getFullYear();
  const month = _date.getMonth() + 1;
  const day = _date.getDate();
  const hour = _date.getHours();
  const minute = _date.getMinutes();
  const second = _date.getSeconds();

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

export { formatterDate };
