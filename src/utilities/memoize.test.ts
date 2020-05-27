import memoize from "utilities/memoize";

describe("memoize", () => {
  const func = memoize((a, b, c) => "x");

  test("will memoize", () => {
    const a = func("a", "b", 1);
    expect(a).toBe("x");
    const b = func("a", "b", 1);
    expect(b).toBe("x");
  });
});
