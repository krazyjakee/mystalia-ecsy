import { System, Not } from "ecsy";
import CharacterHighlight, {
  AddCharacterHighlight,
  RemoveCharacterHighlight,
} from "@client/components/CharacterHighlight";
import Drawable from "@client/components/Drawable";
import Position from "@client/components/Position";
import { drawBorderAroundCharacter } from "./border";
import { drawableToDrawableProperties } from "@client/utilities/drawing";
import TileMap from "@client/components/TileMap";
import { Loadable } from "@client/components/Loadable";

export type CharacterHighlightType = "focus" | "battle" | "damage" | "heal";

export default class CharacterHighlightSystem extends System {
  static queries = {
    tileMaps: {
      components: [TileMap, Not(Loadable)],
    },
    toAddHighlight: {
      components: [AddCharacterHighlight],
    },
    toRemoveHighlight: {
      components: [CharacterHighlight, RemoveCharacterHighlight],
    },
    highlighted: {
      components: [Drawable, Position, CharacterHighlight],
    },
  };

  execute() {
    this.queries.toAddHighlight.results.forEach((enemyEntity) => {
      const highlight = enemyEntity.getComponent(AddCharacterHighlight);
      const currentHighlight = enemyEntity.getMutableComponent(
        CharacterHighlight
      );

      if (highlight.type) {
        let newHighlights: CharacterHighlightType[] = [];
        if (currentHighlight) {
          newHighlights = currentHighlight.types;
        }

        if (newHighlights.includes(highlight.type) === false) {
          newHighlights.push(highlight.type);
        }

        if (currentHighlight) {
          currentHighlight.types = newHighlights;
        } else {
          enemyEntity.addComponent(CharacterHighlight, {
            types: newHighlights,
          });
        }
      }

      enemyEntity.removeComponent(AddCharacterHighlight);
    });

    this.queries.toRemoveHighlight.results.forEach((enemyEntity) => {
      const currentHighlight = enemyEntity.getMutableComponent(
        CharacterHighlight
      );
      const removeHighlight = enemyEntity.getComponent(
        RemoveCharacterHighlight
      );
      const newHighlights = currentHighlight.types.filter(
        (type) => type !== removeHighlight.type
      );
      currentHighlight.types = newHighlights;
      enemyEntity.removeComponent(RemoveCharacterHighlight);
    });

    const tileMap =
      this.queries.tileMaps.results.length && this.queries.tileMaps.results[0];
    if (!tileMap) return;
    const tileMapDrawable = tileMap.getComponent(Drawable);
    const { offset } = tileMapDrawable;

    this.queries.highlighted.results.forEach((characterEntity) => {
      const highlights = characterEntity.getMutableComponent(
        CharacterHighlight
      );
      const position = characterEntity.getComponent(Position);
      const drawable = characterEntity.getComponent(Drawable);

      const drawableProperties = drawableToDrawableProperties(drawable);

      if (highlights.types.includes("battle")) {
        drawBorderAroundCharacter(
          drawableProperties,
          position.value,
          offset,
          "#ff0000",
          80
        );
      } else if (highlights.types.includes("focus")) {
        drawBorderAroundCharacter(
          drawableProperties,
          position.value,
          offset,
          "#ffffff",
          80
        );
      }
    });
  }
}
