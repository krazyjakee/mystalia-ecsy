import gameState from "@client/gameState";
import { RoomMessageType } from "types/gameState";

type GameSetting = "musicVolume" | "sfxVolume";

export default class Storage {
  static init() {
    (["musicVolume", "sfxVolume"] as GameSetting[]).forEach((key) => {
      Storage.trigger(key);
    });
  }

  static getSettingKey(key: GameSetting) {
    return `setting:${key}` as RoomMessageType;
  }

  static set(key: GameSetting, value: any) {
    const settingKey = Storage.getSettingKey(key);
    gameState.trigger(settingKey, value);
    localStorage.setItem(settingKey, value);
  }

  static get(key: GameSetting) {
    return localStorage.getItem(Storage.getSettingKey(key));
  }

  static trigger(key: GameSetting) {
    const value = Storage.get(key);
    if (value) {
      gameState.trigger(Storage.getSettingKey(key), value);
    }
  }
}
