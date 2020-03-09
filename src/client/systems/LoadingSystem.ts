import { System, Entity } from "ecsy";
import { Loadable, SimpleLoadable } from "../components/Loadable";
import Drawable from "../components/Drawable";
import { loadImage, loadData } from "../utilities/assets";

export default class Loader extends System {
  static queries = {
    unLoadedResources: {
      components: [SimpleLoadable, Loadable, Drawable]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.unLoadedResources.results.forEach(async (resource: Entity) => {
      const loadable = resource.getComponent(Loadable);
      const drawable = resource.getComponent(Drawable);

      const { imagePath, dataPath, loading } = loadable;

      if (!loading) {
        if (imagePath) {
          loadable.loading = true;
          const img = await loadImage(imagePath);
          drawable.image = img;
        }

        if (dataPath) {
          loadable.loading = true;
          const { data } = await loadData(dataPath);
          drawable.data = data;
        }

        resource.removeComponent(Loadable);
        resource.removeComponent(SimpleLoadable);
      }
    });
  }
}
