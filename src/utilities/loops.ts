export const objectForEach = <T extends Object>(
  obj: T,
  callback: (key: string, value: T[keyof T]) => void
) => {
  for (let key in obj) {
    callback(key, obj[key]);
  }
};

export const objectMap = <T extends Object, K>(
  obj: T,
  callback: (key: keyof T, value: T[keyof T]) => K
) => {
  const result = {} as Record<keyof T, K>;
  for (let key in obj) {
    result[key] = callback(key, obj[key]);
  }
  return result;
};

export const objectFindValue = <T extends Object>(
  obj: T,
  callback: (key: keyof T, value: T[keyof T]) => any
) => {
  for (let key in obj) {
    if (callback(key, obj[key])) {
      return obj[key];
    }
  }
};

export const objectFilter = <T extends Object, K>(
  obj: T,
  callback: (key: keyof T, value: T[keyof T]) => Boolean
) => {
  let result = {} as Partial<T>;
  for (let key in obj) {
    if (callback(key, obj[key])) {
      result[key] = obj[key];
    }
  }
  return result;
};
