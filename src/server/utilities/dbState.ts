import PlayerState from "../components/player";
import users, { IUser } from "@colyseus/social/src/models/User";
import { isPresent } from "utilities/guards";
import { InventoryStateProps } from "serverState/inventory";
import ItemSchema from "../db/ItemSchema";
import EnemySchema from "../db/EnemySchema";
import { mongoose } from "@colyseus/social";
import { MapSchema } from "@colyseus/schema";

export const savePlayerState = async (player: PlayerState, room: string) => {
  if (player.dbId) {
    const user = await users.findById(player.dbId);

    if (user) {
      let inventory: InventoryStateProps[] = [];

      if (player.inventory) {
        inventory = Object.keys(player.inventory)
          .filter((key) => isPresent(player.inventory[key].itemId))
          .map((key) => {
            const { itemId, position, quantity } = player.inventory[key];
            return { itemId, position, quantity };
          });
      }

      const newData: Partial<IUser> = {
        metadata: {
          ...user.metadata,
          inventory,
          room,
        },
      };

      if (player.targetTile) {
        newData.metadata.currentTile = player.targetTile;
      }

      await user.updateOne({
        $set: newData,
      });
    }
  }
};

const schemas = {
  Item: {
    schema: ItemSchema,
    fields: ["itemId", "quantity", "tileId"],
  },
  Enemy: {
    schema: EnemySchema,
    fields: ["enemyId", "zoneId", "currentTile"],
  },
};

export const saveStateToDb = async (
  key: string,
  roomName: string,
  state: MapSchema<any>
) => {
  const { schema, fields } = schemas[key];
  const indexIds = Object.keys(state);
  if (indexIds.length) {
    const Model = mongoose.model(key, schema);
    try {
      const savePromises = indexIds.map((index) => {
        const fieldsToSave = {};
        Object.keys(state[index]).forEach((fieldKey) => {
          if (fields.includes(fieldKey)) {
            fieldsToSave[fieldKey] = state[index][fieldKey];
          }
        });

        const item = {
          ...fieldsToSave,
          room: roomName,
          index,
        };

        return Model.findOneAndUpdate(
          {
            index,
          },
          item,
          { upsert: true }
        );
      });

      await Promise.all(savePromises);
      console.log(`Saved ${indexIds.length} ${key}s in "${roomName}" to db.`);
    } catch (err) {
      console.error(err);
    }
  }
};
