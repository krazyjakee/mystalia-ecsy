import { Component } from "ecsy";
import { CharacterHighlightType } from "@client/systems/Rendering/CharacterHighlightSystem";

export default class CharacterHighlight extends Component<CharacterHighlight> {
  types: CharacterHighlightType[] = [];
  opacityPercent: number = 80;
}

export class AddCharacterHighlight extends Component<AddCharacterHighlight> {
  type?: CharacterHighlightType;
}

export class RemoveCharacterHighlight extends Component<
  RemoveCharacterHighlight
> {
  type?: CharacterHighlightType;
}
