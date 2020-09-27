import axios from "axios";
import { domainBase } from "./url";

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
  const result = await axios.get(path);
  return result.data;
};

export const mapAssetPath = (name: string) =>
  `${domainBase}/maps?filename=${name}`;

export const itemAssetPath = (name: string) => `/assets/items/${name}.png`;

export const characterAssetPath = (name: string) =>
  `/assets/characters/${name}.png`;

export const effectAssetPath = (name: string) => `/assets/effects/${name}.png`;

export const musicAssetPath = (name: string) => `/assets/music/${name}.mp3`;

export const sfxAssetPath = (name: string) => `/assets/sfx/${name}.mp3`;
