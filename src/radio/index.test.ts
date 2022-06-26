import { mount } from "@vue/test-utils";
import { ElRadio, ElRadioButton, ElRadioGroup } from "element-plus";
import type { ComponentOptionsWithoutProps } from "vue";
import { ElRadioTestUtils } from "./index";

const createElRadioInstance = (options: ComponentOptionsWithoutProps = {}) => {
  Object.assign(options, {
    components: {
      "el-radio-group": ElRadioGroup,
      "el-radio-button": ElRadioButton,
      "el-radio": ElRadio,
    },
  });

  const wrapper = mount(options);
  return wrapper;
};

describe("ElRadioTestUtils", () => {
  test("getGroupChecked & getGroupDisabled", () => {
    const wrapper = createElRadioInstance({
      template: `
      <el-radio-group class="radio-group" v-model="radio">
        <el-radio :label="3">Option A</el-radio>
        <el-radio :label="6">Option B</el-radio>
        <el-radio :label="9" disabled>Option C</el-radio>
      </el-radio-group>
      `,
      data() {
        return {
          radio: 3,
        };
      },
    });

    const {
      getGroupChecked,
      getGroupDisabled,
      getRadioLabel,
      getRadioValue,
    } = new ElRadioTestUtils(wrapper);

    const checkedRadio = getGroupChecked(".radio-group");
    expect(checkedRadio).toBeDefined();
    expect(getRadioLabel(checkedRadio!)).toBe("Option A");
    expect(getRadioValue(checkedRadio!)).toBe("3");

    const disabledCheckbox = getGroupDisabled(".radio-group");
    const disabledLabels = disabledCheckbox.map((checkbox) => getRadioLabel(checkbox));
    const disabledValues = disabledCheckbox.map((checkbox) => getRadioValue(checkbox));

    expect(disabledLabels).toEqual([ "Option C" ]);
    expect(disabledValues).toEqual([ "9" ]);
  });

  test("click", async () => {
    const wrapper = createElRadioInstance({
      template: `
      <el-radio-group class="radio-group" v-model="radio">
        <el-radio :label="3">Option A</el-radio>
        <el-radio :label="6">Option B</el-radio>
        <el-radio :label="9" disabled>Option C</el-radio>
      </el-radio-group>
      `,
      data() {
        return {
          radio: "",
        };
      },
    });

    const {
      getGroupChecked,
      getRadioValue,
      select,
    } = new ElRadioTestUtils(wrapper);

    let checkedRadio = getGroupChecked(".radio-group");
    expect(checkedRadio).toBeUndefined();

    await select("6");
    await select("9");
    checkedRadio = getGroupChecked(".radio-group");
    expect(checkedRadio).toBeDefined();

    expect(getRadioValue(checkedRadio!)).toBe("6");
  });

  // test("size & border", () => {
  // });
});
