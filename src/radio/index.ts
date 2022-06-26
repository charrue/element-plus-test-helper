import type { DOMWrapper, VueWrapper } from "@vue/test-utils";
import { triggerDomEvent } from "../utils/triggerDomEvent";
import { BaseTestHelper } from "../BaseTestHelper";

export class ElRadioTestUtils extends BaseTestHelper {
  public displayName = "ElRadio";

  getRadioGroupDomWrapper = (selector?: string) => this.ensureDomWrapper(selector, "el-radio-group");

  getRadioGroupWrapper = (selector?: string) => this.getVueWrapper(selector);

  getGroupChecked = (selector?: string) => {
    const checkboxGroupWrapper = this.getRadioGroupWrapper(selector);
    const wrappers = checkboxGroupWrapper
      .findAllComponents({ name: "ElRadio" }).concat(checkboxGroupWrapper.findAllComponents({ name: "ElCheckboxButton" }));
    return wrappers.find((item) => item.classes("is-checked"));
  };

  getGroupDisabled = (selector?: string) => {
    const checkboxGroupWrapper = this.getRadioGroupWrapper(selector);
    const wrappers = checkboxGroupWrapper
      .findAllComponents({ name: "ElRadio" }).concat(checkboxGroupWrapper.findAllComponents({ name: "ElCheckboxButton" }));
    return wrappers.filter((item) => item.classes("is-disabled"));
  };

  getRadioLabel = (wrapper: VueWrapper<any>) => wrapper.find(".el-radio__label").text();

  getRadioValue = (wrapper: VueWrapper<any>) => wrapper.find(".el-radio__original").attributes("value");

  select = async (value: string, containerSelector?: string) => {
    let parentWrapper: DOMWrapper<Element> | VueWrapper = this.wrapper;
    if (containerSelector) {
      const containerWrapper = this.wrapper.find(containerSelector);
      if (containerWrapper) {
        parentWrapper = containerWrapper;
      }
    }
    const targetRadioWrapper = parentWrapper.find(`.el-radio__original[value="${value}"]`);
    const radioContainerEl = targetRadioWrapper.element.parentElement;
    if (radioContainerEl) {
      await triggerDomEvent(radioContainerEl, "click");
    }
  };
}
