import { Schema, type } from "@colyseus/schema";

export default class AdminState extends Schema {
  @type("boolean")
  enabled: boolean = true;
}
