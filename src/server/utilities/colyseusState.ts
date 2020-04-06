import { MapSchema, Schema } from "@colyseus/schema";

// TODO remove this function when this issue is fixed https://github.com/colyseus/colyseus/issues/320
export const safeMapSchemaIndex = (index: number | string) => `i${index}`;

export const arrayToMapSchema = <T extends Schema>(
  array: Array<Partial<T>>,
  Klass: any
) => {
  let schema: MapSchema<T> = new MapSchema<T>();
  array.forEach(
    (item, index) => (schema[safeMapSchemaIndex(index)] = new Klass(item))
  );
  return schema;
};
