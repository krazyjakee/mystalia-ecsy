import { Component, Types } from "ecsy";
import { CharacterHighlightType } from "@client/systems/Rendering/CharacterHighlightSystem";

export default class CharacterHighlight extends Component<CharacterHighlight> {
  static schema = {
    types: { default: [], type: Types.Array },
    opacityPercent: { default: 80, type: Types.Number },
  };
  types: CharacterHighlightType[] = [];
  opacityPercent: number = 80;
}

export class AddCharacterHighlight extends Component<AddCharacterHighlight> {
  static schema = {
    type: { type: Types.String },
  };
  type?: CharacterHighlightType;
}

export class RemoveCharacterHighlight extends Component<
  RemoveCharacterHighlight
> {
  type?: CharacterHighlightType;
}
