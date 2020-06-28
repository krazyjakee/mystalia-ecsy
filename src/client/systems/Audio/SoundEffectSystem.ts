import { System, Not } from "ecsy";
import Audio, { SoundEffect } from "@client/components/Audio";
import { Loadable } from "@client/components/Loadable";

export default class SoundEffectSystem extends System {
  muted = false;
  maxVolume = 0.8;

  static queries = {
    soundEffect: {
      components: [SoundEffect, Not(Loadable)],
      listen: {
        added: true,
      },
    },
  };

  init() {
    // set max volume using gameState listener event
  }

  execute() {
    if (!this.queries.soundEffect.added?.length) return;

    const soundEffectEntity = this.queries.soundEffect.added[0];
    if (!soundEffectEntity) return;

    const audioComponent = soundEffectEntity.getComponent(Audio);
    const audio = audioComponent.audio;
    if (audio && audio.paused && audio.seekable.length) {
      audio.onended = () => {
        soundEffectEntity.remove();
      };
      audio.volume = this.maxVolume;
      audio.play();
    }
  }
}
