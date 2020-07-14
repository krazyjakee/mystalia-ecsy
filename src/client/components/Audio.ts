import { Component, TagComponent, Types } from "ecsy";

export default class Audio extends Component<Audio> {
  static schema = {
    audioPath: { type: Types.String },
    audio: { type: Types.JSON },
  };
  audioPath?: string;
  audio?: HTMLAudioElement;
}
export class AudioFadeIn extends TagComponent {}
export class AudioFadeOut extends TagComponent {}

export class NextMusic extends Component<NextMusic> {
  static schema = {
    audioPath: { type: Types.String },
  };
  audioPath?: string;
}

export class Music extends TagComponent {}

export class SoundEffect extends TagComponent {}
