import { System, Entity } from "ecsy";
import { Remove } from "@client/components/Tags";

export default class CleanupSystem extends System {
  static queries = {
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
