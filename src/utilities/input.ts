export const triggerGlobalKeypress = (key: string) => {
  document.dispatchEvent(new KeyboardEvent("keyup", { code: `Key${key}` }));
};
