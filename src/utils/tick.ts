import { nextTick } from "vue";

export const tick = async (times: number) => {
  while (times--) {
    // eslint-disable-next-line no-await-in-loop
    await nextTick();
  }
};

// in order to test transitions, we need to use
// await rAF() after firing transition events.
export const rAF = async () => new Promise((res) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(async () => {
      res(null);
      await nextTick();
    });
  });
});
