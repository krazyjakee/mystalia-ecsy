import { System } from "ecsy";
import { ResultQuery } from "types/ecsy";
import { Loadable } from "../components/Loadable";
import { Drawable } from "../components/Drawable";
import { loadImage, loadData } from "../utilities/assets";

export default class Loader extends System {
  static queries = {
    resources: {
      components: [Loadable, Drawable]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.resources.results.forEach(async resource => {
      const loadable = resource.getComponent(Loadable);
      const drawable = resource.getComponent(Drawable);

      const { imagePath, dataPath, loaded } = loadable;

      if (!loaded) {
        if (imagePath) {
          loadable.loaded = true;
          const img = await loadImage(imagePath);
          drawable.image = img;
        }

        if (dataPath) {
          loadable.loaded = true;
          const data = await loadData(dataPath);
          drawable.data = data;
        }
      }
    });
  }
}
