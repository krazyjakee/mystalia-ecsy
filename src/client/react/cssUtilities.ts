export const guiAssetPath = (path: string, excludeUrlWrapper?: boolean) => {
  const result = `/assets/gui/${path}`;
  if (excludeUrlWrapper) {
    return result;
  }
  new Image().src = result;
  return `url(${result})`;
};

export const spellAssetPath = (path: string) => {
  const result = `/assets/spells/${path}`;
  new Image().src = result;
  return `url(${result})`;
};

export const portraitPath = (portrait: string) => {
  const result = `/assets/portrait/${portrait}.png`;
  return `url(${result})`;
};
