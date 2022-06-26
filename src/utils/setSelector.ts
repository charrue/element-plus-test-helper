// type Handler = (...args: any[]) => any;

// export const setSelectorFactory = <T extends Record<string, Handler>>(actions: T) => (selector: string) => {
//   const defaultActions = {};
//   return Object.keys(actions).reduce((acc, key: string) => {
//     acc[key] = (...args: any[]) => actions[key](selector, ...args);
//     return acc;
//   }, defaultActions);
// };
