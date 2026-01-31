import { useState, useMemo } from "react";
import dayjs from "dayjs";

export function useStatsData(allExpenses, colors) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [viewType, setViewType] = useState("monthly");

  const unit = viewType === "monthly" ? "month" : "year";
  const dateFormat = viewType === "monthly" ? "MM-DD" : "YYYY-MM";

  // handling navigation
  const handlePrev = () => {
    setCurrentDate(currentDate.subtract(1, unit));
  };

  const handleNext = () => {
    setCurrentDate(currentDate.add(1, unit));
  };

  // filtering data
  const filteredExpenses = useMemo(() => {
    return allExpenses.filter((item) => {
      const itemDate = dayjs(item.created_at);
      return itemDate.isSame(currentDate, unit);
    });
  }, [allExpenses, currentDate, unit]);

  // statistical data
  const stats = useMemo(() => {
    if (!filteredExpenses.length)
      return { pieData: [], barData: [], categories: [], totalAmount: 0 };

    const uniqueCategories = [
      ...new Set(filteredExpenses.map((t) => t.category)),
    ];

    const pieMap = {};
    uniqueCategories.forEach((cat) => (pieMap[cat] = 0));
    let currentTotal = 0;

    const grouped = filteredExpenses.reduce((acc, curr) => {
      pieMap[curr.category] += curr.amount;
      currentTotal += curr.amount;

      const dateKey = dayjs(curr.created_at).format(dateFormat);

      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey };
        uniqueCategories.forEach((cat) => (acc[dateKey][cat] = 0));
      }

      acc[dateKey][curr.category] += curr.amount;
      return acc;
    }, {});

    const sortedBarData = Object.values(grouped).sort((a, b) =>
      a.date > b.date ? 1 : -1,
    );

    const formattedPieData = Object.entries(pieMap).map(
      ([name, value], index) => ({
        name,
        value,
        fill: colors[index % colors.length],
      }),
    );

    return {
      pieData: formattedPieData,
      barData: sortedBarData,
      categories: uniqueCategories,
      totalAmount: currentTotal,
    };
  }, [filteredExpenses, dateFormat, colors]);

  // boundary check
  const now = dayjs();
  const isFuture =
    currentDate.isSame(now, unit) || currentDate.isAfter(now, unit);

  const firstExpenseDate =
    allExpenses.length > 0 ? dayjs(allExpenses.at(-1).created_at) : null;
  const isPast =
    firstExpenseDate &&
    (currentDate.isSame(firstExpenseDate, unit) ||
      currentDate.isBefore(firstExpenseDate, unit));

  return {
    currentDate,
    viewType,
    setViewType,
    handlePrev,
    handleNext,
    filteredExpenses,
    ...stats,
    isFuture,
    isPast,
    unit,
  };
}
