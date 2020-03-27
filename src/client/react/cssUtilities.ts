export const guiAssetPath = (path: string, excludeUrlWrapper?: boolean) => {
  const result = `/assets/gui/${path}`;
  if (excludeUrlWrapper) {
    return result;
  }
  return `url(${result})`;
};
