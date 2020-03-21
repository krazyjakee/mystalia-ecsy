import { IUser } from "colyseus.js/lib/Auth";

export default interface User extends IUser {
  metadata: {
    currentTile: number;
    room: string;
  };
}
