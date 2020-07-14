export const isPresent = <T>(t: T | undefined | null | void): t is T =>
  t !== undefined && t !== null;

export const isDrawable = (t: any) =>
  t instanceof HTMLImageElement || t instanceof HTMLCanvasElement;

export const clone = <T extends any>(t: T): T => {
  if (Array.isArray(t)) return t.slice(0) as T;
  if (typeof t === "object") return Object.assign({}, t);
  return t;
};
