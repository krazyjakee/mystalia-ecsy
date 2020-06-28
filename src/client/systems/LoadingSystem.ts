import { System, Entity } from "ecsy";
import { Loadable, SimpleLoadable } from "@client/components/Loadable";
import Drawable from "@client/components/Drawable";
import { loadImage, loadData, loadAudio } from "../utilities/assets";
import Audio from "@client/components/Audio";

export default class Loader extends System {
  static queries = {
    unLoadedResources: {
      components: [SimpleLoadable, Loadable, Drawable],
    },
    unLoadedAudio: {
      components: [Audio, Loadable],
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

    this.queries.unLoadedAudio.results.forEach(async (resource: Entity) => {
      const loadable = resource.getMutableComponent(Loadable);
      const audio = resource.getMutableComponent(Audio);

      const { audioPath, loading } = loadable;

      if (!loading) {
        if (audioPath) {
          loadable.loading = true;
          const audioElement = await loadAudio(audioPath);
          audio.audio = audioElement;
        }

        resource.removeComponent(Loadable);
        resource.removeComponent(SimpleLoadable);
      }
    });
  }
}
