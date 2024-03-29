import PlayerState, { UserDBState } from "../components/player";
import users, { IUser } from "@colyseus/social/src/models/User";
import { isPresent } from "utilities/guards";
import InventoryState, {
  InventoryStateProps,
} from "@server/components/inventory";
import ItemSchema from "../db/ItemSchema";
import EnemySchema from "../db/EnemySchema";
import { mongoose } from "@colyseus/social";
import { MapSchema, ArraySchema, Schema } from "@colyseus/schema";
import WeatherSchema from "../db/WeatherSchema";
import LootSchema from "@server/db/LootSchema";
import { objectMap } from "utilities/loops";
import { nameByRace } from "fantasy-name-generator";

export const savePlayerState = async (player: PlayerState, room: string) => {
  if (player.dbId) {
    const user = await users.findById(player.dbId);

    if (user) {
      let inventory: InventoryStateProps[] = [];

      if (player.inventory) {
        inventory = Object.values(
          objectMap(
            player.inventory,
            (_, { itemId, position, quantity, equipped }: InventoryState) =>
              isPresent(itemId)
                ? { itemId, position, quantity, equipped }
                : undefined
          )
        ).filter(isPresent);
      }

      const newData: Partial<IUser> = {
        metadata: {
          xp: 0,
          damage: 0,
          energyUsed: 0,
          ...user.metadata,
          inventory,
          room,
        },
      };

      if (player.targetTile) {
        newData.metadata.currentTile = player.targetTile;
      }

      if (player.targetEnemy) {
        newData.metadata.targetEnemy = player.targetEnemy;
      }

      await user.updateOne({
        $set: newData,
      });
    }
  }
};

export const resetPlayerState = async (dbId: string) => {
  const user = await users.findById(dbId);
  if (user) {
    const customName = nameByRace("elf", { gender: "male" });
    if (typeof customName === "string") {
      await user.updateOne({
        $set: {
          displayName: customName,
          username: customName.toLowerCase(),
          metadata: UserDBState,
        },
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
    fields: ["enemyId", "zoneId", "currentTile", "damage"],
  },
  Weather: {
    schema: WeatherSchema,
    fields: ["biome", "weathers", "duration"],
  },
  Loot: {
    schema: LootSchema,
    fields: ["lootId", "tileId", "items"],
  },
};

export const saveStateToDb = async (
  key: string,
  roomName: string,
  state: MapSchema<any> | ArraySchema<any>,
  manipulator?: (obj: any) => any
) => {
  const { schema, fields } = schemas[key];
  const indexIds = Object.keys(state);
  if (indexIds.length) {
    const Model = mongoose.model(key, schema);
    await Model.remove({ room: roomName });
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
          ...(manipulator ? manipulator(fieldsToSave) : {}),
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
