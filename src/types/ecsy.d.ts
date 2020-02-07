import { Entity } from "ecsy";

export interface ResultQuery {
  [key: string]: {
    /**
     * All the entities with selected component
     */
    results: Entity[];
    /**
     * All the entities added to the query since the last call
     */
    added?: Entity[];
    /**
     * All the entities removed from the query since the last call
     */
    removed?: Entity[];
    /**
     * All the entities which selected components have changed since the last call
     */
    changed?: Entity[];
  };
}
