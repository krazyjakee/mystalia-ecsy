import PlayerState from "../components/player";
import users, { IUser } from "@colyseus/social/src/models/User";
import { isPresent } from "utilities/guards";

export const savePlayerState = async (player: PlayerState, room: string) => {
  if (player.dbId) {
    const user = await users.findById(player.dbId);

    if (user) {
      const inventory = Object.keys(player.inventory)
        .filter((key) => isPresent(player.inventory[key].itemId))
        .map((key) => {
          const { itemId, position, quantity } = player.inventory[key];
          return { itemId, position, quantity };
        });

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
