export const triggerGlobalKeypress = (key: string) => {
  document.dispatchEvent(
    new KeyboardEvent("keyup", { code: key.length === 1 ? `Key${key}` : key })
  );
};
