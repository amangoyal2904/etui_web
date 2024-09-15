export const chartIntervals = [
  {
    label: "1D",
    value: "1d",
    change: "netChange",
    percentChange: "percentChange",
  },
  { label: "1W", value: "1w", change: "change1Week", percentChange: "r1Week" },
  {
    label: "1M",
    value: "1m",
    change: "change1Month",
    percentChange: "r1Month",
  },
  {
    label: "3M",
    value: "3m",
    change: "change3Month",
    percentChange: "r3Month",
  },
  {
    label: "6M",
    value: "6m",
    change: "change6Month",
    percentChange: "r6Month",
  },
  { label: "1Y", value: "1y", change: "change1Year", percentChange: "r1Year" },
  { label: "3Y", value: "3y", change: "change3Year", percentChange: "r3Year" },
  { label: "5Y", value: "5y", change: "change5Year", percentChange: "r5Year" },
];

export const formatNumber = (
  number: number,
  uptoDecimal: number = 2,
  noData?: string,
): string => {
  if ((!!number && isNaN(number)) || number == null)
    return !!noData ? noData : "-";
  const isInteger = Number.isInteger(Number(number));
  if (isInteger) {
    return number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "decimal",
      minimumFractionDigits: uptoDecimal, // Ensure at least 2 decimal places
      maximumFractionDigits: uptoDecimal, // Allow maximum of 2 decimal places
    });

    const formattedNumber = formatter.format(number);
    return formattedNumber.replace(/(\d)(?=(\d{3})+\.)/g, "$1,"); // Add commas for thousands separators
  }
};

export const durationOptions = [
  { label: "1 Day", value: "1D", id: 1 },
  { label: "1 Week", value: "1W", id: 2 },
  { label: "1 Month", value: "1M", id: 3 },
  { label: "3 Months", value: "3M", id: 4 },
  { label: "6 Months", value: "6M", id: 5 },
  { label: "1 Year", value: "1Y", id: 6 },
  { label: "3 Years", value: "3Y", id: 7 },
  { label: "5 Years", value: "5Y", id: 8 },
];