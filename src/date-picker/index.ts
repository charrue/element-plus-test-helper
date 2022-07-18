/* eslint-disable max-statements */
import { rAF } from "../utils/tick";
import { BaseTestHelper } from "../BaseTestHelper";
import type { VueWrapper } from "@vue/test-utils";
import {
  getDataObj,
  getVisibleDatePickerPanel,
  moveYear,
  moveMonth,
  selectDay,
} from "./helper";

export class ElDatePickerTestHelper extends BaseTestHelper {
  public displayName = "ElDatePicker";

  /**
   * @description 获取`.el-date-editor`的wrapper
   */
  getDatePickerWrapper = (selector?: string) => {
    selector = this.checkSelector(selector);

    let datePickerWrapper = this.wrapper.find<HTMLDivElement>(selector!);
    if (!datePickerWrapper.classes("el-date-editor")) {
      datePickerWrapper = datePickerWrapper.find(".el-date-editor");
    }
    return datePickerWrapper;
  };

  getDatePickerComponentWrapper = (selector?: string): VueWrapper<any> | undefined => {
    selector = this.checkSelector(selector);

    const allComponentWrapper = (this.wrapper as any).findAllComponents({ name: "ElDatePicker" });
    return allComponentWrapper
      .find((t: any) => t.find(selector!).exists())! as VueWrapper<any> | undefined;
  };

  focus = async (selector?: string) => {
    selector = this.checkSelector(selector);

    const datePickerWrapper = this.getDatePickerWrapper(selector);
    const inputWrapper = datePickerWrapper.find(".el-input__inner");
    await inputWrapper.trigger("blur");
    await inputWrapper.trigger("focus");
    await rAF();
  };

  /**
   * @description 获取el-date-picker的`value` prop
   */
  getValue = (selector?: string) => {
    selector = this.checkSelector(selector);

    const datePickerComponentWrapper = this.getDatePickerComponentWrapper(selector);
    return datePickerComponentWrapper?.props("modelValue");
  };

  selectYear = async () => {
    //
  };

  selectMonth = async () => {
    //
  };

  selectDate = async (date: string, selector?: string) => {
    selector = this.checkSelector(selector);

    const datePickerComponentWrapper = this.getDatePickerComponentWrapper(selector);

    if (datePickerComponentWrapper?.props("type") !== "date") {
      this.error(`in ${selector} el-date-picker type is not date, please set type to date`);
    }

    await this.focus(selector);

    const {
      year: currentYear,
      month: currentMonth,
    } = getDataObj(new Date());

    const {
      year: targetYear,
      month: targetMonth,
      day: targetDay,
    } = getDataObj(new Date(date));

    const yearInterval = targetYear - currentYear;
    const monthInterval = targetMonth - currentMonth;

    try {
      const panelContainer = getVisibleDatePickerPanel();
      console.log(panelContainer.className);
      await moveYear(yearInterval, panelContainer);
      await moveMonth(monthInterval, panelContainer);
      await selectDay(targetDay, panelContainer);
    } catch (e: any) {
      this.error(e);
    }
  };

  selectDates = async () => {
    //
  };

  selectDateTime = async () => {
    //
  };

  selectDateWeek = async () => {
    //
  };

  selectDateTimeRange = async () => {
    //
  };

  selectDateRange = async (startDate: string, endDate: string, selector?: string) => {
    selector = this.checkSelector(selector);

    const datePickerComponentWrapper = this.getDatePickerComponentWrapper(selector);

    if (datePickerComponentWrapper?.props("type") !== "daterange") {
      this.error(`in ${selector} el-date-picker type is not daterange, please set type to daterange`);
    }

    const rangeInputWrapper = datePickerComponentWrapper?.find(".el-date-editor .el-range-input");
    await rangeInputWrapper?.trigger("blur");
    await rangeInputWrapper?.trigger("focus");
    await rAF();

    try {
      const panelContainer = getVisibleDatePickerPanel();
      const leftPanelContainer = panelContainer.querySelector(".el-date-range-picker__content.is-left");
      const {
        year: currentYear,
        month: currentMonth,
      } = getDataObj(new Date());

      const {
        year: startYear,
        month: startMonth,
        day: startDay,
      } = getDataObj(new Date(startDate));

      await moveYear(startYear - currentYear, panelContainer);
      // 向前或向后移动startMonth - currentMonth次后，左侧的panel就是startMonth月
      await moveMonth(startMonth - currentMonth, panelContainer);
      // 选择startMonth月的startDay日
      await selectDay(startDay, leftPanelContainer!);

      const {
        year: endYear,
        month: endMonth,
        day: endDay,
      } = getDataObj(new Date(endDate));

      await moveYear(endYear - startYear, panelContainer);
      await moveMonth(endMonth - startMonth, panelContainer);
      await selectDay(endDay, leftPanelContainer!);
    } catch (e: any) {
      this.error(e);
    }
  };

  selectMonthRange = async () => {
    //
  };

  clear = async (selector?: string) => {
    selector = this.checkSelector(selector);

    const componentWrapper = this.getDatePickerComponentWrapper(selector);
    if (componentWrapper?.props("clearable")) {
      await componentWrapper?.find(".el-input__icon.clear-icon").trigger("click");
      return true;
    }
    this.error(`in ${selector} el-date-picker clearable is false`);
    return false;
  };
}
