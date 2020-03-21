import PlayerState from "../components/player";
import users from "@colyseus/social/src/models/User";

export const savePlayerState = async (player: PlayerState, room: string) => {
  if (player.dbId) {
    const user = await users.findById(player.dbId);

    await user?.updateOne({
      $set: {
        metadata: {
          currentTile: player.targetTile,
          room: room
        }
      }
    });
  }
};
