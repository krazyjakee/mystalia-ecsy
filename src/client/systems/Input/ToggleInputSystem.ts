import { System, Entity } from "ecsy";
import LocalPlayer from "../../components/LocalPlayer";
import TileMap from "../../components/TileMap";
import { Loadable, Unloadable } from "../../components/Loadable";
import { KeyboardInput, MouseInput } from "../../components/Tags";

export default class ToggleInputSystem extends System {
  static queries = {
    localPlayer: { components: [LocalPlayer] },
    loadedMap: { components: [TileMap, Loadable], listen: { added: true } },
    unloadedMap: { components: [TileMap, Unloadable], listen: { added: true } },
  };

  execute() {
    //@ts-ignore
    this.queries.loadedMap.added.forEach(() => {
      //@ts-ignore
      this.queries.localPlayer.results.forEach((entity: Entity) => {
        entity.addComponent(KeyboardInput).addComponent(MouseInput);
      });
    });
    //@ts-ignore
    this.queries.unloadedMap.added.forEach(() => {
      //@ts-ignore
      this.queries.localPlayer.results.forEach((entity: Entity) => {
        entity.removeComponent(KeyboardInput).removeComponent(MouseInput);
      });
    });
  }
}
