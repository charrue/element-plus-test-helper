import { mount } from "@vue/test-utils";
import { ElDatePicker, dayjs } from "element-plus";
import type { ComponentOptionsWithoutProps } from "vue";
import { ElDatePickerTestHelper } from "./index";

const createElDatePickerInstance = (options: ComponentOptionsWithoutProps) => {
  Object.assign(options, {
    components: {
      "el-date-picker": ElDatePicker,
    },
  });

  const wrapper = mount(options);
  return wrapper;
};

const SELECTOR = ".date-picker";
const createDatePickerCase = (params: {
  defaultValue?: string,
  type?: string
} = {}) => {
  const {
    defaultValue = "",
    type = "date",
  } = params;
  return createElDatePickerInstance({
    template: `
      <div>
      <el-date-picker class="date-picker" v-model="defaultValue" :type="type" placeholder="Pick a day" />
      </div>
    `,
    data() {
      return {
        defaultValue,
        type,
      };
    },
  });
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ElDatePickerTestHelper", () => {
  test("selectDate", async () => {
    const wrapper = createDatePickerCase();

    const { selectDate, getValue } = new ElDatePickerTestHelper(wrapper, SELECTOR);

    const targetDate = "2000-11-10";
    await selectDate(targetDate);
    const expectedValue = getValue();
    expect(dayjs(expectedValue).format("YYYY-MM-DD")).toBe(targetDate);
  });

  test.only("selectDateRange", async () => {
    const wrapper = createDatePickerCase({ type: "daterange" });
    const { selectDateRange, getValue } = new ElDatePickerTestHelper(wrapper, SELECTOR);

    const startDate = "2000-11-10";
    const endDate = "2010-07-02";
    await selectDateRange(startDate, endDate);
    const expectedValue = getValue() as Date[];
    expect(expectedValue.map((t) => dayjs(t).format("YYYY-MM-DD"))).toEqual([startDate, endDate]);
  });
});
