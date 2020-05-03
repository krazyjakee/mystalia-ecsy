import { MapSchema, Schema } from "@colyseus/schema";
import { randomHash } from "utilities/hash";

export const arrayToMapSchema = <T extends Schema>(
  array: Array<Partial<T>>,
  Klass: any
) => {
  let schema: MapSchema<T> = new MapSchema<T>();
  array.forEach((item, index) => (schema[randomHash()] = new Klass(item)));
  return schema;
};

export const searchState = (state: MapSchema<any>, obj: Object) => {
  let hits: string[] = [];

  for (let k in state) {
    let match = true;
    for (let j in obj) {
      if (state[k][j] !== obj[j]) {
        match = false;
      }
    }
    if (match) {
      hits.push(k);
    }
  }

  return hits;
};
