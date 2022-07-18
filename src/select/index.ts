import type { VueWrapper, DOMWrapper } from "@vue/test-utils";
import { rAF } from "../utils/tick";
import { triggerDomEvent } from "../utils/triggerDomEvent";
import { BaseTestHelper } from "../BaseTestHelper";

const INVALID_INDEX = -1;

export class ElSelectTestUtils extends BaseTestHelper {
  public displayName = "ElSelect";

  getSelectDomWrapper = <T extends Element = Element>(selector: string): DOMWrapper<T> => {
    let selectWrapper = this.wrapper.find<T>(selector);
    if (!selectWrapper.classes("el-select")) {
      selectWrapper = selectWrapper.find(".el-select");
    }
    return selectWrapper;
  };

  getSelectVmWrapper = (selector: string): VueWrapper<any> => {
    const selectWrapper = this.getSelectDomWrapper(selector);
    return selectWrapper.findComponent({ name: "ElSelect" });
  };

  getOptions: () => HTMLElement[] = () => Array.from(document.querySelectorAll<HTMLElement>("body > div:last-child .el-select-dropdown__item"));

  getOptionLabels = (params: { onlyDisabled?: boolean } = {}) => {
    const { onlyDisabled = false } = params;

    const options = this.getOptions();
    return options.filter((option) => {
      if (option.style.display === "none") return false;

      if (onlyDisabled) {
        return option.classList.contains("is-disabled");
      }
      return true;
    })
      .map((option) => option.children[0].textContent);
  };

  getOption = (valueOrIndex: string | number) => {
    const options = this.getOptions();
    const optionLabels = this.getOptionLabels();

    let index = INVALID_INDEX;
    if (typeof valueOrIndex === "number") {
      if (valueOrIndex < 0 || valueOrIndex > options.length - 1) {
        throw new Error(`if value is number, it should be in [0, ${options.length - 1}]`);
      } else {
        index = valueOrIndex;
      }
    } else {
      index = optionLabels.indexOf(valueOrIndex);
      if (index === INVALID_INDEX) {
        throw new Error(`${valueOrIndex} is not in the options`);
      }
    }

    return options[index];
  };

  getDisabled = (selector: string) => {
    const selectWrapper = this.getSelectDomWrapper(selector);
    const classes = selectWrapper.classes();
    return classes.includes("is-disabled");
  };

  getMultiple = (selector: string) => {
    const selectComponentWrapper = this.getSelectVmWrapper(selector);
    return selectComponentWrapper.props("multiple");
  };

  getOptionDisabled = (valueOrIndex: string | number) => {
    const option = this.getOption(valueOrIndex);
    return option.classList.contains("is-disabled");
  };

  getValue = async (selector: string) => {
    await rAF();
    const selectComponentWrapper = this.getSelectVmWrapper(selector);
    return selectComponentWrapper.vm.modelValue;
  };

  async select(valueOrIndex: string | number, selector: string) {
    await rAF();
    const selectWrapper = this.getSelectDomWrapper(selector);

    await selectWrapper.find(".select-trigger").trigger("click");
    const targetSelectOption = this.getOption(valueOrIndex);
    await triggerDomEvent(targetSelectOption, "click");
  }

  async clear(selector: string) {
    const selectComponentWrapper = this.getSelectVmWrapper(selector);
    if (!selectComponentWrapper.props("clearable")) {
      console.warn(`el-select clearable prop should true in ${selector}`);
      return false;
    }

    const value = await this.getValue(selector);
    if (!value) {
      console.warn(`el-select value is empty in ${selector}`);
      return false;
    }

    selectComponentWrapper.vm.inputHovering = true;
    await rAF();
    const closeIconWrapper = this.wrapper.find(".el-select__caret.el-select__icon");
    if (!closeIconWrapper.exists()) {
      console.warn("el-select clear icon not found");
      return false;
    }

    await closeIconWrapper.trigger("click");
    return true;
  }

  inputValue = async (value: string, selector: string) => {
    const selectComponentWrapper = this.getSelectVmWrapper(selector);
    if (!selectComponentWrapper.props("filterable")) {
      console.warn(`el-select filterable prop should true in ${selector}`);
      return false;
    }

    const inputWrapper = selectComponentWrapper.find<HTMLInputElement>(".el-select__input");
    try {
      await inputWrapper.trigger("focus");
      await inputWrapper.setValue(value);
      await rAF();
      return true;
    } catch (e: any) {
      console.warn(e);
      return false;
    }
  };

  createValue = async (value: string, selector: string) => {
    const selectComponentWrapper = this.getSelectVmWrapper(selector);
    if (!selectComponentWrapper.props("allowCreate")) {
      console.warn(`el-select allow-create prop should true in ${selector}`);
      return false;
    }

    await this.inputValue(value, selector);

    const options = this.getOptions().filter((t) => t.style.display !== "none");
    await triggerDomEvent(options[0], "click");
    await rAF();
    return true;
  };
}
