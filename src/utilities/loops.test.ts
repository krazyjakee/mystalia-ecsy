import {
  objectForEach,
  objectMap,
  objectFilter,
  objectFindValue,
} from "./loops";

describe("loops", () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  };

  describe("#objectForEach", () => {
    test("should loop over items in object", () => {
      const values: Array<number | string> = [];
      objectForEach(obj, (key, value) => {
        values.push(key, value);
      });
      expect(values).toStrictEqual(["a", 1, "b", 2, "c", 3]);
    });
  });

  describe("#objectMap", () => {
    test("should loop over items in object and change values", () => {
      const values = objectMap(obj, (key) => key);
      expect(values).toStrictEqual({
        a: "a",
        b: "b",
        c: "c",
      });
    });
  });

  describe("#objectFindValue", () => {
    test("should loop over items in object and return a specific one", () => {
      const values = objectFindValue(obj, (key) => key === "b");
      expect(values).toBe(2);
    });
  });

  describe("#objectFilter", () => {
    test("should loop over items in object return filtered fields", () => {
      const values = objectFilter(obj, (_, value) => value > 1);
      expect(values).toStrictEqual({
        b: 2,
        c: 3,
      });
    });
  });
});
