export const guiAssetPath = (path: string, excludeUrlWrapper?: boolean) => {
  const result = `/assets/gui/${path}`;
  if (excludeUrlWrapper) {
    return result;
  }
  new Image().src = result;
  return `url(${result})`;
};
