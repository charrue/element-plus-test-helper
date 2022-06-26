import { BaseTestHelper } from "../BaseTestHelper";
import { DefinedComponent } from "@vue/test-utils/dist/types";

export class ElButtonTestHelper extends BaseTestHelper {
  public displayName = "ElButton";

  /**
   * @description 根据传入的选择器，获取DOMWrapper
   * @param selector 选择元素的selector，默认使用`defaultSelector`，如果`defaultSelector`为空，则使用`wrapper`的第一个类名
   */
  getElButtonDomWrapper = (selector?: string) => {
    selector = this.checkSelector(selector);

    return this.ensureDomWrapper<HTMLButtonElement>(selector, "el-button");
  };

  /**
   * @description 根据传入的选择器，获取VueWrapper
   * @todo memoize
   * @param selector 选择元素的selector，默认使用`defaultSelector`，如果`defaultSelector`为空，则使用`wrapper`的第一个类名
   */
  getElButtonWrapper = <T extends DefinedComponent = DefinedComponent>(
    selector?: string,
  ) => this.getVueWrapper<T>(selector);

  /**
   * @description 获取el-button的`loading`状态
   * @param selector 选择元素的selector，默认使用`defaultSelector`，如果`defaultSelector`为空，则使用`wrapper`的第一个类名
   * @returns el-button是否处于loading中
   */
  getLoading = (selector?: string) => {
    const elButtonWrapper = this.getElButtonWrapper(selector);
    return elButtonWrapper?.props("loading");
  };

  /**
   * @description 获取el-button的`disabled`状态
   * @param selector 选择元素的selector，默认使用`defaultSelector`，如果`defaultSelector`为空，则使用`wrapper`的第一个类名
   * @returns { boolean } el-button是否处于disabled中
   */
  getDisabled = (selector?: string) => {
    const elButtonWrapper = this.getElButtonWrapper(selector);
    return elButtonWrapper?.props("disabled");
  };

  /**
   * @description 触发按钮的点击事件
   * @param selector 选择元素的selector，默认使用`defaultSelector`，如果`defaultSelector`为空，则使用`wrapper`的第一个类名
   */
  click = async (selector?: string) => {
    selector = this.checkSelector(selector);

    await this.getElButtonWrapper(selector)?.trigger("click");
  };
}
