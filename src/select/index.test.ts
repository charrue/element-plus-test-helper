import { afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ElSelect, ElOption } from "element-plus";
import type { ComponentOptionsWithoutProps } from "vue";
import { ElSelectTestUtils } from "./index";

const SELECTOR = ".select";

const createElSelectInstance = (options: ComponentOptionsWithoutProps = {}) => {
  Object.assign(options, {
    components: {
      "el-select": ElSelect,
      "el-option": ElOption,
    },
  });

  const wrapper = mount(options);
  return wrapper;
};

const createElSelectCase = (params: {
  multiple?: boolean;
  clearable?: boolean;
  filterable?: boolean;
  allowCreate?: boolean;
} = {}) => {
  const {
    multiple = false,
    clearable = false,
    filterable = false,
    allowCreate = false,
  } = params;

  const DefaultOption = "Option1";
  const wrapper = createElSelectInstance({
    template: `
      <div>
        <el-select
          class="select"
          v-model="value"
          :multiple="multiple"
          :clearable="clearable"
          :filterable="filterable"
          :allow-create="allowCreate"
        >
          <el-option label="Option1" value="Option1"></el-option>
          <el-option label="Option2" value="Option2"></el-option>
          <el-option label="Option3" value="Option3"></el-option>
          <el-option label="Option4" value="Option4" disabled></el-option>
        </el-select>
      </div>
    `,
    data() {
      return {
        value: multiple ? [ DefaultOption ] : DefaultOption,
        multiple,
        clearable,
        filterable,
        allowCreate,
      };
    },
  });
  return wrapper;
};

describe("ElSelectTestUtils", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("check options", () => {
    const wrapper = createElSelectCase();

    const { getOptionLabels, getOptionDisabled } = new ElSelectTestUtils(wrapper);

    expect(getOptionLabels()).toEqual(["Option1", "Option2", "Option3", "Option4"]);
    expect(getOptionLabels({ onlyDisabled: true })).toEqual([ "Option4" ]);
    expect(getOptionDisabled("Option4")).toBe(true);
    expect(getOptionDisabled(1)).toBe(false);
  });

  test("select", async () => {
    const wrapper = createElSelectCase();

    const { select, getValue } = new ElSelectTestUtils(wrapper);

    let value = await getValue(SELECTOR);
    expect(value).toBe("Option1");

    await select("Option3", SELECTOR);
    value = await getValue(SELECTOR);
    expect(value).toBe("Option3");

    await select("Option4", SELECTOR);
    value = await getValue(SELECTOR);
    expect(value).toBe("Option3");

    await select(1, SELECTOR);
    value = await getValue(SELECTOR);
    expect(value).toBe("Option2");
  });

  test("multiple select", async () => {
    const wrapper = createElSelectCase({ multiple: true });
    const { select, getValue, getMultiple } = new ElSelectTestUtils(wrapper);

    expect(getMultiple(SELECTOR)).toBe(true);

    await select("Option3", SELECTOR);
    let value = await getValue(SELECTOR);
    expect(value).toEqual(["Option1", "Option3"]);

    await select("Option4", SELECTOR);
    value = await getValue(SELECTOR);
    expect(value).toEqual(["Option1", "Option3"]);

    await select("Option3", SELECTOR);
    value = await getValue(SELECTOR);
    expect(value).toEqual([ "Option1" ]);
  });

  describe("clear", () => {
    test("clearable prop is false", async () => {
      const wrapper = createElSelectCase({ clearable: false });
      const { clear } = new ElSelectTestUtils(wrapper);

      expect(await clear(SELECTOR)).toBeFalsy();
    });

    test("clearable prop is true", async () => {
      const wrapper = createElSelectCase({ clearable: true });
      const { clear, getValue, select } = new ElSelectTestUtils(wrapper);

      expect(await clear(SELECTOR)).toBeTruthy();

      let value = await getValue(SELECTOR);
      expect(value).toBe("");

      expect(await clear(SELECTOR)).toBeFalsy();

      await select(0, SELECTOR);
      await select("Option2", SELECTOR);

      expect(await clear(SELECTOR)).toBeTruthy();
      value = await getValue(SELECTOR);
      expect(value).toBe("");
    });
  });

  describe("inputValue", () => {
    test("filterable prop is false", async () => {
      const wrapper = createElSelectCase({ filterable: false });
      const { inputValue } = new ElSelectTestUtils(wrapper);
      expect(await inputValue("Option1", SELECTOR)).toBeFalsy();
    });
    test("filterable prop is true", async () => {
      const wrapper = createElSelectCase({ filterable: true });
      const { inputValue, getOptionLabels } = new ElSelectTestUtils(wrapper);
      expect(await inputValue("1", SELECTOR)).toBeTruthy();

      const labels = getOptionLabels();

      expect(labels).toEqual([ "Option1" ]);
    });
  });

  describe("createValue", () => {
    test("allow-create prop is false", async () => {
      const wrapper = createElSelectCase({ allowCreate: false });
      const { createValue } = new ElSelectTestUtils(wrapper);
      expect(await createValue("new Option", SELECTOR)).toBeFalsy();
    });
    test.only("allow-create prop is true", async () => {
      const wrapper = createElSelectCase({ allowCreate: true, filterable: true, multiple: true });
      const { createValue, getValue } = new ElSelectTestUtils(wrapper);
      const newValue = "new";
      expect(await createValue(newValue, SELECTOR)).toBeTruthy();
      const value = await getValue(SELECTOR);
      expect(value).toEqual(["Option1", newValue]);
    });
  });
});
