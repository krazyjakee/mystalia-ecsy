import { System, Entity, Not } from "ecsy";
import client from "../colyseus";
import { Client, Room } from "colyseus.js";
import { SendData, RemotePlayer } from "../components/Tags";
import Movement from "../components/Movement";
import CreateRemotePlayer from "../entities/RemotePlayer";

type EntityData = {
  type: string;
  destination?: number;
};

type EntityLookup = { [index: string]: number };
type DataLookup = { [index: number]: EntityData[] };

export default class Networking extends System {
  client?: Client;
  room?: Room;
  remoteEntities: EntityLookup = {}; // track which entity IDs correspond to which client IDs
  remoteEntityData: DataLookup = {}; // track messages sent from server by entity ID

  static queries = {
    localEntities: {
      components: [SendData, Movement]
    },
    remoteEntities: {
      components: [RemotePlayer, Movement]
    }
  };

  init() {
    this.client = client;
    client.joinOrCreate("first").then(res => {
      this.room = res;
      this.room.onMessage(data => {
        if (data.message.type === "map:listOthers") return; // TODO: handle this!
        if (data.message.type === "map:join") {
          const newPlayer = CreateRemotePlayer();
          this.remoteEntities[data.client] = newPlayer.id;
          this.remoteEntityData[newPlayer.id] = [];
        } else if (data.message.type === "map:leave") {
          // TODO: remove entities and data
        } else if (data.client !== this.room?.sessionId) {
          this.remoteEntityData[this.remoteEntities[data.client]].push(
            data.message
          );
        }
      });
    });
  }

  execute() {
    if (!this.room) return;

    // @ts-ignore
    this.queries.localEntities.results.forEach((entityToSend: Entity) => {
      const movement = entityToSend.getComponent(Movement);
      if (movement.targetTile >= 0) {
        this.room?.send({
          type: "player:move",
          destination: movement.targetTile
        });
      }
      entityToSend.removeComponent(SendData); // now that we've sent the data we remove the component to avoid sending it again
    });

    // @ts-ignore
    this.queries.remoteEntities.results.forEach((entityToUpdate: Entity) => {
      const data = this.remoteEntityData[entityToUpdate.id];
      data.forEach((d: EntityData) => {
        if (d.type === "player:move" && d.destination) {
          const movement = entityToUpdate.getMutableComponent(Movement);
          movement.targetTile = d.destination;
        }
      });
    });
  }
}
