import axios from "axios";

const loadedImages: {
  [key: string]: HTMLImageElement;
} = {};

export const loadImage = async (
  path: string
): Promise<HTMLImageElement | undefined> => {
  return new Promise((accept, reject) => {
    if (loadedImages[path]) {
      accept(loadedImages[path]);
      return;
    }

    const img = document.createElement("img");
    img.src = path;
    img.addEventListener("load", () => {
      loadedImages[path] = img;
      accept(img);
    });
  });
};

export const loadData = async (path: string): Promise<any> => {
  const data = await axios.get(path);
  return data;
};

export const mapAssetPath = (name: string) => `/assets/maps/${name}.json`;

export const itemAssetPath = (name: string) => `/assets/items/${name}.png`;
