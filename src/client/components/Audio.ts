import { Component, TagComponent } from "ecsy";

export default class Audio extends Component {
  audioPath?: string;
  audio?: HTMLAudioElement;
}
export class AudioFadeIn extends TagComponent {}
export class AudioFadeOut extends TagComponent {}

export class NextMusic extends Component {
  audioPath?: string;
}

export class Music extends TagComponent {}

export class SoundEffect extends TagComponent {}
