import { System, Not } from "ecsy";
import Audio, {
  Music,
  AudioFadeIn,
  AudioFadeOut,
  NextMusic,
} from "@client/components/Audio";
import { Loadable } from "@client/components/Loadable";

export default class MusicSystem extends System {
  static queries = {
    music: {
      components: [Music, Not(Loadable), Not(AudioFadeIn), Not(AudioFadeOut)],
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

  execute() {
    const musicEntity = this.queries.music.results[0];
    const audioComponent = musicEntity.getComponent(Audio);
    const audio = audioComponent.audio;
    if (!audio) return;

    if (audio.paused) {
      audio.volume = 0;
      audio.play();
    }

    this.queries.audioFadeIn.results.forEach((fadeInEntity) => {
      if (audio.volume < 100) {
        audio.volume += 0.5;
      } else {
        fadeInEntity.remove();
      }
    });

    this.queries.audioFadeOut.results.forEach((fadeOutEntity) => {
      if (audio.volume > 0) {
        audio.volume -= 0.5;
      } else {
        fadeOutEntity.remove();
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
