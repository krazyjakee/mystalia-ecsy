import { System, Not } from "ecsy";
import Audio, {
  Music,
  AudioFadeIn,
  AudioFadeOut,
  NextMusic,
} from "@client/components/Audio";
import { Loadable } from "@client/components/Loadable";
import gameState from "@client/gameState";
import { isPresent } from "utilities/guards";

export default class MusicSystem extends System {
  volume = 0.8;
  maxVolume = 0.8;
  newMaxVolume: number | undefined;

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

  init() {
    gameState.subscribe("setting:musicVolume", (value) => {
      this.newMaxVolume = parseInt(value) / 100;
    });
  }

  execute() {
    const musicEntity = this.queries.music.results[0];
    if (!musicEntity) return;

    const audioComponent = musicEntity.getMutableComponent(Audio);
    const audio = audioComponent.audio;
    if (audio) {
      if (audio.paused && audio.seekable.length) {
        audio.loop = true;
        this.volume = 0;
        audio.play();
      }
      if (
        isPresent(this.newMaxVolume) &&
        !musicEntity.hasComponent(AudioFadeIn) &&
        !musicEntity.hasComponent(AudioFadeOut)
      ) {
        audio.volume = this.newMaxVolume;
        this.maxVolume = this.newMaxVolume;
        this.newMaxVolume = undefined;
      }
    }

    this.queries.audioFadeIn.results.forEach((fadeInEntity) => {
      if (audio && audio.volume < this.maxVolume) {
        this.volume = Math.min(audio.volume + 0.001, this.maxVolume);
        audio.volume = this.volume;
      } else {
        fadeInEntity.removeComponent(AudioFadeIn);
      }
    });

    this.queries.audioFadeOut.results.forEach((fadeOutEntity) => {
      if (audio && audio.volume > 0) {
        this.volume = Math.max(audio.volume - 0.001, 0);
        audio.volume = this.volume;
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
        if (nextMusic.audioPath) {
          audioComponent.audioPath = nextMusic.audioPath;
          musicEntity.addComponent(Loadable, {
            audioPath: nextMusic.audioPath,
          });
          musicEntity.addComponent(AudioFadeIn);
          musicEntity.removeComponent(NextMusic);
        } else {
          musicEntity.removeComponent(NextMusic);
        }
      }
    });
  }
}
