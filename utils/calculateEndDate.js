function calculateEndDate(startDate) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + 14);
  return date.toISOString().split("T")[0];
}

module.exports = calculateEndDate;
