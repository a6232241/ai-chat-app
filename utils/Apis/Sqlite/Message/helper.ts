import moment from "moment";

const normalizeTimestamp = (timestamp: number) => {
  return timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
};

const formatterDate = (date: number) => {
  let _date = new Date(normalizeTimestamp(date));
  return moment(_date).format("YYYY-MM-DD HH:mm:ss");
};

export { formatterDate };
