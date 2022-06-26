/* eslint-disable @typescript-eslint/ban-ts-comment */
import { mount } from "@vue/test-utils";
import { ElButton } from "element-plus";
import type { ComponentOptionsWithoutProps } from "vue";
import { ElButtonTestHelper } from "./index";

const createElButtonInstance = (options: ComponentOptionsWithoutProps = {}) => {
  Object.assign(options, {
    components: {
      "el-button": ElButton,
    },
  });

  const wrapper = mount(options);
  return wrapper;
};

describe("ElButtonTestHelper", () => {
  test("loading & disabled", async () => {
    const wrapper = createElButtonInstance({
      template: `
        <div>
          <el-button data-id="button" :loading="loading" :disabled="disabled">state</el-button>
          <el-button data-id="loading" @click="setLoading">setLoading</el-button>
          <el-button data-id="disabled" @click="setDisabled">setDisabled</el-button>
        </div>
      `,
      data() {
        return {
          loading: false,
          disabled: false,
        };
      },
      methods: {
        setLoading() {
          // @ts-ignore
          this.loading = true;
          // @ts-ignore
          this.disabled = false;
        },
        setDisabled() {
          // @ts-ignore
          this.loading = false;
          // @ts-ignore
          this.disabled = true;
        },
      },
    });

    const { getLoading, getDisabled, click } = new ElButtonTestHelper(wrapper, "[data-id=button]");

    expect(getLoading()).toBe(false);
    expect(getDisabled()).toBe(false);

    await click("[data-id=loading]");
    expect(getLoading()).toBe(true);
    expect(getDisabled()).toBe(false);

    await click("[data-id=disabled]");
    expect(getLoading()).toBe(false);
    expect(getDisabled()).toBe(true);
  });
});
