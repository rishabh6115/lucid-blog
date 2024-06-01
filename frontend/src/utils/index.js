export const displayedString = (str, length) => {
  return str.length > length ? str.substring(0, length) + "..." : str;
};

export const getIndianDate = (timestamp) => {
  const dateObj = new Date(timestamp);
  const options = {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  return dateObj.toLocaleDateString("en-IN", options);
};
