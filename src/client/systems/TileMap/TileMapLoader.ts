import { System, Entity, Not } from "ecsy";
import { TileMap as TileMapComponent } from "../../components/TileMap";
import { Loadable } from "../../components/Loadable";
import { Drawable } from "../../components/Drawable";
import { Layer, TMJ } from "types/TMJ";
import { ObjectTileStore } from "../../utilities/TileMap/ObjectTileStore";
import { loadImage } from "../../utilities/assets";

export default class TileMap extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), Drawable, TileMapComponent],
      listen: {
        added: true
      }
    }
  };

  execute() {
    // @ts-ignore
    this.queries.loadedTileMaps.added.forEach(async (tileMapEntity: Entity) => {
      const drawable = tileMapEntity.getComponent(Drawable);
      const data: TMJ = drawable.data;
      const tileMap = tileMapEntity.getComponent(TileMapComponent);

      // Handy map size in pixels
      tileMap.width = data.width * 32;
      tileMap.height = data.height * 32;

      // Layers should be sorted by id so they are rendered in order
      data.layers.sort((a: Layer, b: Layer) => parseInt(a.id) - parseInt(b.id));

      // Create an object store from the object tiles
      tileMap.objectTileStore = new ObjectTileStore(data.width, data.height);
      data.layers.forEach(layer => tileMap.objectTileStore?.add(layer));

      // Set the map name
      tileMap.name =
        data.properties.find(property => property.name === "name")?.value ||
        "first";

      // Setup the astar pathfinding grid
      const aStarGridData = tileMap.objectTileStore.getBlockGrid();
      if (aStarGridData) {
        tileMap.aStar.setGrid(aStarGridData);
        tileMap.aStar.setAcceptableTiles([0]);
      }

      // Save tileset data and download assets
      const { tilesets } = data;
      tilesets.sort((a, b) => b.firstgid - a.firstgid);
      for (let i = 0; i < tilesets.length; i += 1) {
        const tileset = tilesets[i];
        const tileSetImage = await loadImage(
          `/assets/tilesets/${tileset.image}`
        );
        if (tileSetImage) {
          tileMap.tileSetStore[tileset.image] = tileSetImage;
        }
      }

      // Everything is good to go!
      tileMap.loaded = true;
    });
  }
}
