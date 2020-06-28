import { System, Not } from "ecsy";
import Audio, {
  Music,
  AudioFadeIn,
  AudioFadeOut,
  NextMusic,
} from "@client/components/Audio";
import { Loadable } from "@client/components/Loadable";

export default class MusicSystem extends System {
  savedVolume = 0;
  muted = false;
  maxVolume = 0.8;

  static queries = {
    music: {
      components: [Music, Not(Loadable)],
    },
    audioFadeIn: {
      components: [Music, AudioFadeIn, Not(Loadable)],
    },
    audioFadeOut: {
      components: [Music, AudioFadeOut, Not(Loadable)],
    },
    nextMusic: {
      components: [Music, NextMusic, Not(Loadable)],
      listen: {
        added: true,
      },
    },
  };

  setVolume(audio: HTMLAudioElement, newVolume: number) {
    if (this.muted) {
      this.savedVolume = newVolume;
    } else {
      audio.volume = newVolume;
    }
  }

  execute() {
    const musicEntity = this.queries.music.results[0];
    if (!musicEntity) return;

    const audioComponent = musicEntity.getComponent(Audio);
    const audio = audioComponent.audio;
    if (audio) {
      if (audio.paused && audio.seekable.length) {
        audio.loop = true;
        audio.volume = 0;
        audio.play();
      }
    }

    this.queries.audioFadeIn.results.forEach((fadeInEntity) => {
      if (audio && audio.volume < this.maxVolume) {
        this.setVolume(audio, Math.min(audio.volume + 0.001, this.maxVolume));
      } else {
        fadeInEntity.removeComponent(AudioFadeIn);
      }
    });

    this.queries.audioFadeOut.results.forEach((fadeOutEntity) => {
      if (audio && audio.volume > this.maxVolume) {
        this.setVolume(audio, Math.max(audio.volume - 0.001, 0));
      } else {
        fadeOutEntity.removeComponent(AudioFadeOut);
      }
    });

    this.queries.nextMusic.added?.forEach((nextMusicEntity) => {
      nextMusicEntity.addComponent(AudioFadeOut);
    });

    this.queries.nextMusic.results.forEach((nextMusicEntity) => {
      if (!nextMusicEntity.hasComponent(AudioFadeOut)) {
        const nextMusic = nextMusicEntity.getComponent(NextMusic);
        audioComponent.audio = undefined;
        audioComponent.audioPath = nextMusic.audioPath;
        musicEntity.addComponent(Loadable, { audioPath: nextMusic.audioPath });
        musicEntity.addComponent(AudioFadeIn);
        musicEntity.removeComponent(NextMusic);
      }
    });
  }
}
