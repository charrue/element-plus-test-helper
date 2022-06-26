import { mount } from "@vue/test-utils";
import { ElCheckbox, ElCheckboxButton, ElCheckboxGroup } from "element-plus";
import type { ComponentOptionsWithoutProps } from "vue";
import { CheckboxTestUtils } from "./index";

const createElCheckboxInstance = (options: ComponentOptionsWithoutProps = {}) => {
  Object.assign(options, {
    components: {
      "el-checkbox-group": ElCheckboxGroup,
      "el-checkbox-button": ElCheckboxButton,
      "el-checkbox": ElCheckbox,
    },
  });

  const wrapper = mount(options);
  return wrapper;
};

describe("CheckboxTestUtils", () => {
  test("getGroupChecked & getGroupDisabled", () => {
    const wrapper = createElCheckboxInstance({
      template: `
      <el-checkbox-group class="checkbox-group" v-model="checkList">
        <el-checkbox label="A">Option A</el-checkbox>
        <el-checkbox label="B">Option B</el-checkbox>
        <el-checkbox label="C">Option C</el-checkbox>
        <el-checkbox label="disabled" disabled />
        <el-checkbox label="selected and disabled" disabled />
      </el-checkbox-group>
      `,
      data() {
        return {
          checkList: ["A", "selected and disabled"],
        };
      },
    });

    const {
      getGroupChecked,
      getGroupDisabled,
      getCheckboxLabel,
      getCheckboxValue,
    } = new CheckboxTestUtils(wrapper);

    const checkedCheckbox = getGroupChecked(".checkbox-group");
    const checkedLabels = checkedCheckbox.map((checkbox) => getCheckboxLabel(checkbox));
    const checkedValues = checkedCheckbox.map((checkbox) => getCheckboxValue(checkbox));

    expect(checkedLabels).toEqual(["Option A", "selected and disabled"]);
    expect(checkedValues).toEqual(["A", "selected and disabled"]);

    const disabledCheckbox = getGroupDisabled(".checkbox-group");
    const disabledLabels = disabledCheckbox.map((checkbox) => getCheckboxLabel(checkbox));
    const disabledValues = disabledCheckbox.map((checkbox) => getCheckboxValue(checkbox));

    expect(disabledLabels).toEqual(["disabled", "selected and disabled"]);
    expect(disabledValues).toEqual(["disabled", "selected and disabled"]);
  });

  test("click", async () => {
    const onChange = vi.fn();
    const wrapper = createElCheckboxInstance({
      template: `
      <el-checkbox-group class="checkbox-group" v-model="checkList" @change="onChange">
        <el-checkbox label="A">Option A</el-checkbox>
        <el-checkbox id="b" label="B">Option B</el-checkbox>
        <el-checkbox label="C">Option C</el-checkbox>
        <el-checkbox label="disabled" disabled />
        <el-checkbox label="selected and disabled" disabled />
      </el-checkbox-group>
      `,
      data() {
        return {
          checkList: ["A", "selected and disabled"],
        };
      },
      methods: {
        onChange,
      },
    });

    const {
      getGroupChecked,
      getCheckboxValue,
      select,
    } = new CheckboxTestUtils(wrapper);

    // TODO jsdom^19.0.0似乎没有触发click事件，使用了jsdom@16.4.0后就可以使用了
    await select("B");
    await select("C");
    await select("C");
    await select("disabled");

    const checkedCheckbox = getGroupChecked(".checkbox-group");
    const checkedValues = checkedCheckbox.map((checkbox) => getCheckboxValue(checkbox));

    expect(checkedValues).toEqual(["A", "B", "selected and disabled"]);
  });
});
