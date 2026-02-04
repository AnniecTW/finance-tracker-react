import { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";

export function useStatsData(allExpenses, colors) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [viewType, setViewType] = useState("monthly");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const internalFormat = viewType === "monthly" ? "YYYY-MM-DD" : "YYYY-MM";
  const unit = viewType === "monthly" ? "month" : "year";

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
      const itemDate = dayjs(item.created_at).startOf("day");
      return itemDate.isSame(currentDate, unit);
    });
  }, [allExpenses, currentDate, unit]);

  // statistical data
  const stats = useMemo(() => {
    const fillMissingDates = (
      groupedData,
      viewType,
      categories,
      referenceDate,
    ) => {
      const finalized = [];
      let startDate, endDate, dateUnit;

      if (viewType === "monthly") {
        startDate = dayjs(referenceDate).startOf("month");
        endDate = dayjs(referenceDate).endOf("month");
        dateUnit = "day";
      } else {
        startDate = dayjs(referenceDate).startOf("year");
        endDate = dayjs(referenceDate).endOf("year");
        dateUnit = "month";
      }

      let current = startDate;

      while (current.isBefore(endDate) || current.isSame(endDate, dateUnit)) {
        const dateKey = current.format(internalFormat);

        if (groupedData[dateKey]) {
          finalized.push(groupedData[dateKey]);
        } else {
          const emptyEntry = { date: dateKey };
          categories.forEach((cat) => (emptyEntry[cat] = 0));
          finalized.push(emptyEntry);
        }
        current = current.add(1, dateUnit);
      }

      return finalized;
    };

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

      const dateKey = dayjs(curr.created_at).format(internalFormat);

      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey };
        uniqueCategories.forEach((cat) => (acc[dateKey][cat] = 0));
      }

      acc[dateKey][curr.category] += curr.amount;
      return acc;
    }, {});

    const finalizedBarData = fillMissingDates(
      grouped,
      viewType,
      uniqueCategories,
      currentDate,
    );

    const sortedBarData = [...finalizedBarData].sort((a, b) =>
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
  }, [filteredExpenses, viewType, internalFormat, currentDate, colors]);

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

  // bar chart aspect ratio handling
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chartAspect = useMemo(() => {
    if (windowWidth > 1200) return 1.5;
    if (windowWidth < 500) return 0.9;

    return windowWidth < 800 ? 1.0 : 1.2;
  }, [windowWidth]);

  // bar chart customed label
  const formatXAxis = (value) => {
    if (viewType === "yearly") {
      return dayjs(value).format("MMM");
    }
    return dayjs(value).format("D");
  };

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
    chartAspect,
    windowWidth,
    formatXAxis,
  };
}
