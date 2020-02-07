import { System } from "ecsy";
import { Layer } from "../components/TileMap";
import { ResultQuery } from "types/ecsy";

class TileMap extends System {
  queries: ResultQuery = {};

  static queries = {
    layers: {
      components: [Layer]
    }
  };

  execute() {
    this.queries.layers.results.forEach(layer => {
      console.log("Iterating on entity: ", layer.id);
    });
  }
}
