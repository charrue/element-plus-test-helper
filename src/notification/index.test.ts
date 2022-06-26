import { mount } from "@vue/test-utils";
import { ElNotification } from "element-plus";
import { ElNotificationTestUtils } from "./index";

describe("ElNotificationTestUtils", () => {
  test("hasNotification", () => {
    const wrapper = mount({
      template: `<div>
        <button id="btn1" @click="showNotification()">base use</button>
        <button id="btn2" @click="showNotification('success')">success message</button>
      </div>`,
      methods: {
        showNotification(type?: "success") {
          if (type) {
            ElNotification({
              type,
              title: "Title",
              message: "Hello World",
            });
          } else {
            ElNotification({
              type,
              title: "Title",
              message: "Hello World",
            });
          }
        },
      },
    });

    const { getNotification } = new ElNotificationTestUtils();
    expect(getNotification()).toBeNull();
    const btn1 = wrapper.find("#btn1");

    btn1.trigger("click");
    expect(getNotification()).toBeDefined();
  });
});
