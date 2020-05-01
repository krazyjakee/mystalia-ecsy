import MapRoom from "@server/rooms/map";

export default class Battle {
  room: MapRoom;
  timer: NodeJS.Timeout;

  constructor(room: MapRoom) {
    this.room = room;

    // @ts-ignore
    this.timer = setInterval(() => this.tick(), 1000);
  }

  tick() {
    // TODO: Get all players in room who are targetting
    // TODO: Get all enemies in room who are targetting
    // TODO: Get players equipped items
    // TODO: Get enemy abilities
    // TODO: Detect if player is close enough to target to attack
    // TODO: Detect if enemy is close enough to target to attack
    // TODO: Perform attacks
  }
}
