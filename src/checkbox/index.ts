import type { DOMWrapper, VueWrapper } from "@vue/test-utils";
import { triggerDomEvent } from "../utils/triggerDomEvent";
import { BaseTestHelper } from "../BaseTestHelper";

export class CheckboxTestUtils extends BaseTestHelper {
  public displayName = "ElCheckbox";

  getCheckboxGroupDomWrapper = (selector?: string) => this.ensureDomWrapper(selector, "el-checkbox-group");

  getCheckboxGroupWrapper = (selector?: string) => this.getVueWrapper(selector);

  getGroupChecked = (selector?: string) => {
    const checkboxGroupWrapper = this.getCheckboxGroupWrapper(selector);
    const wrappers = checkboxGroupWrapper
      .findAllComponents({ name: "ElCheckbox" }).concat(checkboxGroupWrapper.findAllComponents({ name: "ElCheckboxButton" }));
    return wrappers.filter((item: VueWrapper<any>) => item.classes("is-checked"));
  };

  getGroupDisabled = (selector?: string) => {
    const checkboxGroupWrapper = this.getCheckboxGroupWrapper(selector);
    const wrappers = checkboxGroupWrapper
      .findAllComponents({ name: "ElCheckbox" }).concat(checkboxGroupWrapper.findAllComponents({ name: "ElCheckboxButton" }));
    return wrappers.filter((item: VueWrapper<any>) => item.classes("is-disabled"));
  };

  getCheckboxLabel = (wrapper: VueWrapper<any>) => wrapper.find(".el-checkbox__label").text();

  getCheckboxValue = (wrapper: VueWrapper<any>) => wrapper.find(".el-checkbox__original").attributes("value");

  select = async (value: string, containerSelector?: string) => {
    let parentWrapper: DOMWrapper<Element> | VueWrapper = this.wrapper;
    if (containerSelector) {
      const containerWrapper = this.wrapper.find(containerSelector);
      if (containerWrapper) {
        parentWrapper = containerWrapper;
      }
    }
    const targetCheckboxWrapper = parentWrapper.find(`.el-checkbox__original[value="${value}"]`);
    const checkboxContainerEl = targetCheckboxWrapper.element.parentElement;
    if (checkboxContainerEl) {
      await triggerDomEvent(checkboxContainerEl, "click");
    }
  };
}
