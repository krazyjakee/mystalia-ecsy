import { System, Entity } from "ecsy";
import LocalPlayer from "../../components/LocalPlayer";
import TileMap from "../../components/TileMap";
import { Loadable, Unloadable } from "../../components/Loadable";
import { KeyboardInput, MouseInput } from "src/client/components/Tags";

export default class MapChangeInputSystem extends System {
  static queries = {
    localPlayer: { components: [LocalPlayer] },
    loadedMap: { components: [TileMap, Loadable], added: true },
    unloadedMap: { components: [TileMap, Unloadable], added: true },
  };

  execute() {
    //@ts-ignore
    this.queries.loadedMap.results.forEach(() => {
      //@ts-ignore
      this.queries.localPlayer.results.forEach((entity: Entity) => {
        entity.addComponent(KeyboardInput).addComponent(MouseInput);
      });
    });
    //@ts-ignore
    this.queries.unloadedMap.results.forEach(() => {
      //@ts-ignore
      this.queries.localPlayer.results.forEach((entity: Entity) => {
        entity.removeComponent(KeyboardInput).removeComponent(MouseInput);
      });
    });
  }
}
