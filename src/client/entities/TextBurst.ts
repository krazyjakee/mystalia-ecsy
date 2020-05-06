import TextBurst from "@client/components/TextBurst";
import { getWorld } from "@client/ecsy";
import { Vector } from "types/TMJ";

export default function CreateTextBurst(
  text: string | number,
  colorHex: string,
  position: Vector
) {
  return getWorld()
    .createEntity()
    .addComponent(TextBurst, {
      text,
      colorHex,
      ...position,
    });
}
