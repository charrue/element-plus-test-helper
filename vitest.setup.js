import { config } from "@vue/test-utils";
import { vi } from "vitest";
import ResizeObserver from "resize-observer-polyfill";

// el-select等组件中会监听resize事件，所以需要引入resize-observer-polyfill
vi.stubGlobal("ResizeObserver", ResizeObserver);

config.global.stubs = {};
