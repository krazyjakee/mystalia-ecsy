import { System, Entity } from "ecsy";
import { Remove } from "../components/Tags";
import { StaticQuery } from "types/ecsy";

export default class CleanupSystem extends System {
  static queries: StaticQuery = {
    toRemove: {
      components: [Remove],
    },
  };

  execute() {
    //@ts-ignore
    const remove = [...this.queries.toRemove.results];
    remove.forEach((entity) => entity.remove());
  }
}
