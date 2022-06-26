import { createDOMEvent } from "./createDOMEvent";
import { nextTick } from "vue";

export const triggerDomEvent = async (el: Element, eventName: string, options?: any) => {
  const event = createDOMEvent(eventName, options);
  el.dispatchEvent(event);
  await nextTick();
};
