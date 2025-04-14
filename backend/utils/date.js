export const formatDate = (dateValue) => {
  // Check if the date is valid
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  // Return the formatted date
  return date.toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
