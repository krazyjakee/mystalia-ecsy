import { Entity, Component } from "ecsy";

export interface StaticQuery {
  [key: string]: {
    listen?: {
      added?: boolean;
      removed?: boolean;
      changed?: boolean;
    };
    /**
     * The components in the query
     */
    components: Component[];
  };
}

export interface ResultQuery {
  [key: string]: {
    /**
     * All the entities with selected component
     */
    results: Entity[];
    /**
     * All the entities added to the query since the last call
     */
    added: Entity[];
    /**
     * All the entities removed from the query since the last call
     */
    removed: Entity[];
    /**
     * All the entities which selected components have changed since the last call
     */
    changed: Entity[];
  };
}

declare module "ecsy" {
  /**
   * A system that manipulates entities in the world.
   */
  export abstract class System {
    static queries: StaticQuery;

    queries: ResultQuery;
    /**
     * Whether the system will execute during the world tick.
     */
    enabled: boolean;
    /**
     * Resume execution of this system.
     */
    play(): void;

    /**
     * Stop execution of this system.
     */
    stop(): void;
  }
}
