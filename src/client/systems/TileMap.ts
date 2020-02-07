import { System } from "ecsy";
import { Layer } from "../components/TileMap";
import { ResultQuery } from "types/ecsy";

export default class TileMap extends System {
  static queries = {
    layers: {
      components: [Layer]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.layers.results.forEach(layer => {
      console.log("Iterating on entity: ", layer.id);
    });
  }
}
