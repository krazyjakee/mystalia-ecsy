import { Component, TagComponent } from "ecsy";

type AudioProps = {
  audioPath?: string;
  audio?: HTMLAudioElement;
};

export default class Audio extends Component<AudioProps> {
  audioPath?: string;
  audio?: HTMLAudioElement;
}
export class AudioFadeIn extends TagComponent {}
export class AudioFadeOut extends TagComponent {}

export class NextMusic extends Component<AudioProps> {
  audioPath?: string;
  audio?: HTMLAudioElement;
}

export class Music extends TagComponent {}

export class SoundEffect extends TagComponent {}
