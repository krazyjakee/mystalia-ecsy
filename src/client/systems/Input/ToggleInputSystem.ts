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
    this.queries.loadedMap.added?.forEach(() => {
      this.queries.localPlayer.results?.forEach((entity) => {
        entity.addComponent(KeyboardInput).addComponent(MouseInput);
      });
    });

    this.queries.unloadedMap.added?.forEach(() => {
      this.queries.localPlayer.results.forEach((entity) => {
        entity.removeComponent(KeyboardInput).removeComponent(MouseInput);
      });
    });
  }
}
