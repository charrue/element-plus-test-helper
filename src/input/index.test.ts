import { mount } from "@vue/test-utils";
import { ElInput } from "element-plus";
import type { ComponentOptionsWithoutProps } from "vue";
import { ElInputTestHelper } from "./index";

const createElInputInstance = (options: ComponentOptionsWithoutProps = {}) => {
  Object.assign(options, {
    components: {
      "el-input": ElInput,
    },
  });
  const wrapper = mount(options);
  return wrapper;
};

describe("ElInputTestHelper", () => {
  test("getValue", () => {
    const wrapper = createElInputInstance({
      template: `<el-input class="foo" v-model="inputValue"></el-input>`,
      data() {
        return {
          inputValue: "Hello World",
        };
      },
    });

    const { getValue } = new ElInputTestHelper(wrapper);
    expect(getValue(".foo")).toBe("Hello World");
  });

  test("setValue", async () => {
    const wrapper = createElInputInstance({
      template: `<el-input class="foo" v-model="inputValue"></el-input>`,
      data() {
        return {
          inputValue: "",
        };
      },
    });

    const { setValue, getValue } = new ElInputTestHelper(wrapper, ".foo");
    expect(getValue()).toBe("");
    await setValue("Hello World");
    expect(getValue()).toBe("Hello World");
  });

  test("clear", async () => {
    const wrapper = createElInputInstance({
      template: `<el-input class="foo" v-model="inputValue" clearable></el-input>`,
      data() {
        return {
          inputValue: "Hello World",
        };
      },
    });

    const { clear, getValue } = new ElInputTestHelper(wrapper, ".foo");
    expect(getValue()).toBe("Hello World");
    await clear();
    expect(getValue()).toBe("");
  });

  test("focus & blur", async () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    const wrapper = createElInputInstance({
      template: `<el-input class="foo" modelValue="inputValue" @focus="handleFocus" @blur="handleBlur"></el-input>`,
      data() {
        return {
          inputValue: "Hello World",
        };
      },
      methods: {
        handleFocus,
        handleBlur,
      },
    });

    const { focus, blur } = new ElInputTestHelper(wrapper, ".foo");
    expect(handleFocus).not.toHaveBeenCalled();
    expect(handleBlur).not.toHaveBeenCalled();

    await focus();
    expect(handleFocus).toHaveBeenCalled();

    await blur();
    expect(handleBlur).toHaveBeenCalled();
  });
});
