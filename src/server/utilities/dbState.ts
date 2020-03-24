import PlayerState from "../components/player";
import users, { IUser } from "@colyseus/social/src/models/User";

export const savePlayerState = async (player: PlayerState, room: string) => {
  if (player.dbId) {
    const user = await users.findById(player.dbId);

    if (user) {
      const newData: Partial<IUser> = {
        metadata: {
          room: room
        }
      };

      if (player.targetTile) {
        newData.metadata.currentTile = player.targetTile;
      } else if (user.metadata.currentTile) {
        newData.metadata.currentTile = user.metadata.currentTile;
      }

      await user.updateOne({
        $set: newData
      });
    }
  }
};
