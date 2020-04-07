import { Entity } from "ecsy";
import { Unloadable } from "../../../components/Loadable";
import { mapAssetPath } from "../../../utilities/assets";

export default (tileMapEntity: Entity, nextMap: string) => {
  tileMapEntity.addComponent(Unloadable, {
    dataPath: mapAssetPath(nextMap),
  });
};
