export const formatDate = (dateValue: Date) => {
  // Check if the date is valid
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  // Return the formatted date
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const addThousandsSeparator = (num: number) => {
  // Convert the number to a string and use regular expression to add commas
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
