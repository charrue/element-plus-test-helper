/* eslint-disable max-statements */
import { rAF } from "../utils/tick";

export const ONE_WEEK = 7;

export const getDataObj = (date: Date) => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

export const getVisibleDatePickerPanel = () => Array.from(document
  .querySelectorAll<HTMLDivElement>("body > div > div.el-popper"))
  .find((item) => item.style.display !== "none" && (item.querySelector(".el-picker-panel")))!;

/**
 * 遍历异步函数fn，count次
 */
export const forEachAsync = async (fn: (...args: any) => Promise<any>, count: number) => {
  await Promise.all(Array(Math.abs(count)).fill(0).map(() => fn()));
};

/**
 * 获取`.el-date-table__row`下`.el-date-table-cell`的innerText
 */
export const getWeekCellDays = (weekEl: Element) => Array.from(weekEl?.querySelectorAll<HTMLElement>("td") || []).map((t) => t.children[0].children[0].textContent);

export const toNextMonth = async (panelContainer?: Element) => {
  if (!panelContainer) {
    panelContainer = getVisibleDatePickerPanel();
  }

  const nextMonth = panelContainer.querySelector<HTMLElement>("button.arrow-right");
  nextMonth?.click();
  await rAF();
};

export const toPrevMonth = async (panelContainer?: Element) => {
  if (!panelContainer) {
    panelContainer = getVisibleDatePickerPanel();
  }

  const prevMonth = panelContainer.querySelector<HTMLElement>("button.arrow-left");
  prevMonth?.click();
  await rAF();
};

export const toNextYear = async (panelContainer?: Element) => {
  if (!panelContainer) {
    panelContainer = getVisibleDatePickerPanel();
  }

  const nextYear = panelContainer.querySelector<HTMLElement>("button.d-arrow-right");
  nextYear?.click();
  await rAF();
};

export const toPrevYear = async (panelContainer?: Element) => {
  if (!panelContainer) {
    panelContainer = getVisibleDatePickerPanel();
  }

  const prevYear = panelContainer.querySelector<HTMLElement>("button.d-arrow-left");
  prevYear?.click();
  await rAF();
};

export const moveYear = async (count: number, panelContainer: Element) => {
  if (count > 0) {
    await forEachAsync(() => toNextYear(panelContainer), count);
  }
  if (count < 0) {
    await forEachAsync(() => toPrevYear(panelContainer), Math.abs(count));
  }
};

export const moveMonth = async (count: number, panelContainer: Element) => {
  if (count > 0) {
    await forEachAsync(() => toNextMonth(panelContainer), count);
  }
  if (count < 0) {
    await forEachAsync(() => toPrevMonth(panelContainer), Math.abs(count));
  }
};

export const selectDay = (day: number, panelContainer: Element) => {
  if (!panelContainer) {
    panelContainer = getVisibleDatePickerPanel();
  }

  const weeks = panelContainer.querySelectorAll(".el-picker-panel__content > table > tbody > tr.el-date-table__row");
  const firstWeek = weeks[0];

  // 本月第一周有哪些天
  const firstWeekDays = getWeekCellDays(firstWeek);
  // 从本月第一周中查找出本月1号的位置
  const firstDayIndex = firstWeekDays.findIndex((d) => d === "1");

  // 加上本月第一周，属于上一个月的那些天数
  // 查找出目标日期的行数
  const targetDayRow = 1 + (parseInt(`${((day + firstDayIndex) / ONE_WEEK)}`, 10));
  // 查找出targetDayRow行的所有天数
  const targetDayWeekDays = getWeekCellDays(weeks[targetDayRow - 1]);
  // 查找到目标日期的列数
  const targetDayCol = targetDayWeekDays.findIndex((d) => Number(d) === Number(day)) + 1;

  // 查出目标日期，所处的周次，有哪些天
  const targetDays = Array.from(weeks[targetDayRow - 1].querySelectorAll<HTMLElement>(`td`)).map((t) => t.textContent);

  console.log(`${targetDayRow}-${targetDayCol}`, targetDays);
  const targetDayEl = weeks[targetDayRow - 1].querySelector<HTMLElement>(`td:nth-child(${targetDayCol})`);
  targetDayEl?.click();
};
