import { System, Not } from "ecsy";
import Audio, { SoundEffect } from "@client/components/Audio";
import { Loadable } from "@client/components/Loadable";
import gameState from "@client/gameState";
import { isPresent } from "utilities/guards";

export default class SoundEffectSystem extends System {
  muted = false;
  maxVolume = 0.8;
  newMaxVolume: number | undefined;

  static queries = {
    soundEffect: {
      components: [SoundEffect, Not(Loadable)],
      listen: {
        added: true,
      },
    },
  };

  init() {
    gameState.subscribe("setting:sfxVolume", (value) => {
      this.newMaxVolume = parseInt(value) / 100;
    });
  }

  execute() {
    if (!this.queries.soundEffect.added?.length) return;

    const soundEffectEntity = this.queries.soundEffect.added[0];
    if (!soundEffectEntity) return;

    const audioComponent = soundEffectEntity.getComponent(Audio);
    const audio = audioComponent.audio;
    if (audio) {
      if (audio.paused && audio.seekable.length) {
        audio.onended = () => {
          soundEffectEntity.remove();
        };
        audio.volume = this.maxVolume;
        audio.play();
      }
      if (isPresent(this.newMaxVolume)) {
        audio.volume = this.newMaxVolume;
        this.maxVolume = this.newMaxVolume;
      }
    }
  }
}
