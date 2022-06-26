import type { VueWrapper } from "@vue/test-utils";
import { DefinedComponent } from "@vue/test-utils/dist/types";

export class BaseTestHelper {
  constructor(
    protected wrapper: VueWrapper,
    protected defaultSelector?: string,
  ) { }

  public displayName: string | undefined;

  protected vueWrapperMap = new Map<string, VueWrapper>();

  protected checkSelector(selector?: string) {
    selector = selector || this.defaultSelector;
    if (!selector) {
      selector = this.wrapper.classes()[0];
    }
    return selector;
  }

  protected error(message: string | Error) {
    if (message instanceof Error) {
      throw message;
    }

    if (this.displayName) {
      throw new Error(`[${this.displayName}] ${message}`);
    } else {
      throw new Error(message);
    }
  }

  protected ensureDomWrapper<T extends Element = Element>(selector?: string, className?: string) {
    selector = this.checkSelector(selector);

    let domWrapper = this.wrapper.find<T>(selector);

    // 如果该DOM上不存在`el-button`类名，则判断没有获取到input，则继续向下查找
    if (className && !domWrapper.classes(className)) {
      domWrapper = domWrapper.find(`.${className}`);
    }
    return domWrapper;
  }

  protected getVueWrapper<T extends DefinedComponent = DefinedComponent>(selector?: string) {
    selector = this.checkSelector(selector);
    if (this.vueWrapperMap.has(selector)) {
      return this.vueWrapperMap.get(selector) as VueWrapper<InstanceType<T>>;
    }

    const wrapper = this.wrapper.findComponent<T>(selector!);
    this.vueWrapperMap.set(selector, wrapper);
    return wrapper;
  }
}
