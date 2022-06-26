import { rAF } from "../utils/tick";
import { BaseTestHelper } from "../BaseTestHelper";
export class ElInputTestHelper extends BaseTestHelper {
  getInputWrapper = <T extends Element = HTMLInputElement>(
    selector: string,
  ) => {
    let inputWrapper = this.wrapper.find<T>(selector);

    // 如果该DOM上不存在`el-input__inner`类名，则判断没有获取到input，则继续向下查找
    if (!inputWrapper.classes("el-input__inner")) {
      inputWrapper = inputWrapper.find(".el-input__inner");
    }
    return inputWrapper;
  };

  /**
   * @description 设置el-input的value
   * @param { string } value el-input需要设置的值
   * @param { string } selector 能够定位到el-input的选择器
   * @throws 如果该selector下没有查找到`.el-input__inner`，则在`setValue`时会出现错误
   * @example
   * <el-input id="foo" v-model="value" />
   * const { setValue } = createElInputTestUtils(wrapper)
   * await setValue("foo", "#foo")
   */
  setValue = async (value: string, selector?: string) => {
    selector = this.checkSelector(selector);

    const inputWrapper = this.getInputWrapper(selector);

    inputWrapper.setValue(value);
    await rAF();
  };

  /**
   * @description 获取el-input的value
   * @param { string } selector 能够定位到el-input的选择器
   * @throws 如果该selector下没有查找到`.el-input__inner`，则在`setValue`时会出现错误
   * @example
   * <el-input id="foo" modelValue ="foo" />
   * const { getValue } = createElInputTestUtils(wrapper)
   * getValue("#foo") // foo
   */
  getValue = (selector?: string) => {
    selector = this.checkSelector(selector);

    const inputWrapper = this.getInputWrapper(selector);

    return inputWrapper.element.value;
  };

  /**
   * @description 触发el-input的`focus`事件
   * @param { string } selector 能够定位到el-input的选择器
   * @throws 如果该selector下没有查找到`.el-input__inner`，则在`setValue`时会出现错误
   * @example
   * <el-input id="foo" />
   * const { focus } = createElInputTestUtils(wrapper)
   * await focus("#foo")
   */
  focus = async (selector?: string) => {
    selector = this.checkSelector(selector);

    const inputWrapper = this.getInputWrapper(selector);

    await inputWrapper.trigger("focus");
    await rAF();
  };

  /**
   * @description 触发el-input的`blur`事件
   * @param { string } selector 能够定位到el-input的选择器
   * @throws 如果该selector下没有查找到`.el-input__inner`，则在`setValue`时会出现错误
   * @example
   * <el-input id="foo" />
   * const { blur } = createElInputTestUtils(wrapper)
   * await blur("#foo")
   */
  blur = async (selector?: string) => {
    selector = this.checkSelector(selector);
    const inputWrapper = this.getInputWrapper(selector);

    await inputWrapper.trigger("blur");
    await rAF();
  };

  /**
   * @description 获取el-input的value
   * @param { string } selector 能够定位到el-input的选择器
   * @throws
   * 1. 如果该selector下没有查找到`.el-input__inner`，则在`setValue`时会出现错误
   * 2. 如果`el-input`没有设置`clearable`属性，则无法点击清除图标
   * @see https://github.com/element-plus/element-plus/blob/742bc0d1922d83043950b512a58e78392dba7d3e/packages/components/input/__tests__/input.test.tsx#L394
   * @example
   * <el-input id="foo" modelValue ="foo" />
   * const { clear } = createElInputTestUtils(wrapper)
   * await clear("#foo")
   * getValue("#foo") // ''
   */
  clear = async (selector?: string): Promise<void> => {
    selector = this.checkSelector(selector);
    const inputWrapper = this.getInputWrapper(selector);

    const { value } = inputWrapper.element;
    if (!value) return;

    inputWrapper.trigger("focus");
    await rAF();

    const clearIconWrapper = this.wrapper.find<HTMLElement>(".el-input__clear");
    clearIconWrapper.trigger("click");
    await rAF();
  };
}
