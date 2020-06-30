import { Component } from "ecsy";
import { CharacterHighlightType } from "@client/systems/Rendering/CharacterHighlightSystem";

type CharacterHighlightProps = {
  types: CharacterHighlightType[];
  opacityPercent: number;
};

export default class CharacterHighlight extends Component<
  Partial<CharacterHighlightProps>
> {
  types: CharacterHighlightType[] = [];
  opacityPercent: number = 80;
}

type CharacterHighlightAlterProps = {
  type?: CharacterHighlightType;
};

export class AddCharacterHighlight extends Component<
  CharacterHighlightAlterProps
> {
  type?: CharacterHighlightType;
}

export class RemoveCharacterHighlight extends Component<
  CharacterHighlightAlterProps
> {
  type?: CharacterHighlightType;
}
