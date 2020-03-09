export default (compass: string) => {
  switch (compass) {
    case "n":
      return { x: 0, y: -1 };
    case "e":
      return { x: 1, y: 0 };
    case "s":
      return { x: 0, y: 1 };
    case "w":
      return { x: -1, y: 0 };
  }
  return { x: 0, y: 0 };
};
