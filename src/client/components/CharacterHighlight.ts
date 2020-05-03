import { Component } from "ecsy";
import { CharacterHighlightType } from "@client/systems/Rendering/CharacterHighlightSystem";

export default class CharacterHighlight extends Component {
  types: CharacterHighlightType[] = [];
  opacityPercent: number = 80;
}

export class AddCharacterHighlight extends Component {
  type?: CharacterHighlightType;
}

export class RemoveCharacterHighlight extends Component {
  type?: CharacterHighlightType;
}
