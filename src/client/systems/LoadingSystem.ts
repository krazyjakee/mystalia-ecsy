import { System, Entity } from "ecsy";
import { Loadable, SimpleLoadable } from "@client/components/Loadable";
import Drawable from "@client/components/Drawable";
import { loadImage, loadData } from "../utilities/assets";

export default class Loader extends System {
  static queries = {
    unLoadedResources: {
      components: [SimpleLoadable, Loadable, Drawable],
    },
  };

  execute() {
    this.queries.unLoadedResources.results.forEach(async (resource: Entity) => {
      const loadable = resource.getMutableComponent(Loadable);
      const drawable = resource.getMutableComponent(Drawable);

      const { imagePath, dataPath, loading } = loadable;

      if (!loading) {
        if (imagePath) {
          loadable.loading = true;
          const img = await loadImage(imagePath);
          drawable.image = img;
        }

        if (dataPath) {
          loadable.loading = true;
          const data = await loadData(dataPath);
          drawable.data = data;
        }

        resource.removeComponent(Loadable);
        resource.removeComponent(SimpleLoadable);
      }
    });
  }
}
