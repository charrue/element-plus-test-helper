import { describe, expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import { ElInput } from "element-plus";
import type { ComponentOptionsWithoutProps } from "vue";
import { createElInputTestUtils } from "./index";

const createElInputInstance = (options: ComponentOptionsWithoutProps = {}) => {
  Object.assign(options, {
    components: {
      "el-input": ElInput,
    },
  });
  const wrapper = mount(options);
  return wrapper;
};

describe("createElInputTestUtils", () => {
  test("getValue", () => {
    const wrapper = createElInputInstance({
      template: `<el-input v-model="inputValue"></el-input>`,
      data() {
        return {
          inputValue: "Hello World",
        };
      },
    });

    const { getValue } = createElInputTestUtils(wrapper);
    expect(getValue()).toBe("Hello World");
  });

  test("setValue", () => {
    const wrapper = createElInputInstance({
      template: `<el-input v-model="inputValue"></el-input>`,
      data() {
        return {
          inputValue: "",
        };
      },
    });

    const { setValue, getValue } = createElInputTestUtils(wrapper);
    expect(getValue()).toBe("");
    setValue("Hello World");
    expect(getValue()).toBe("Hello World");
  });

  // test("getElInputVm", () => {
  //   const wrapper = createElInputInstance({
  //     template: `<el-input v-model="inputValue" clearable></el-input>`,
  //     data() {
  //       return {
  //         inputValue: "Hello World",
  //       };
  //     },
  //   });

  //   const { getElInputVm } = createElInputTestUtils(wrapper);
  //   expect(getElInputVm().value).toBe("Hello World");
  //   expect(getElInputVm().clearable).toBe(true);
  // });

  test("clear", async () => {
    const wrapper = createElInputInstance({
      template: `<el-input v-model="inputValue" clearable></el-input>`,
      data() {
        return {
          inputValue: "Hello World",
        };
      },
    });

    const { clear, getValue } = createElInputTestUtils(wrapper);
    expect(getValue()).toBe("Hello World");
    await clear();
    expect(getValue()).toBe("");
  });
});
