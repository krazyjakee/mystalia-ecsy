import gameState from "@client/gameState";
import { RoomMessageType } from "types/gameState";

type GameSetting = "musicVolume" | "sfxVolume";

type AdminSetting = "forceTime:update" | "timePhase:update" | "timeSpec:update";

export default class Storage {
  static init() {
    (["musicVolume", "sfxVolume"] as GameSetting[]).forEach((key) => {
      Storage.trigger(key);
    });

    (["forceTime:update", "timePhase:update", "timeSpec:update"] as AdminSetting[]).forEach((key) => {
      Storage.triggerAdmin(key);
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

  static getAdminKey(key: AdminSetting) {
    return `admin:${key}` as RoomMessageType;
  }

  static setAdmin(key: AdminSetting, value?: any) {
    const settingKey = Storage.getAdminKey(key);
    if (value) {
      gameState.trigger(settingKey, value);
      localStorage.setItem(settingKey, JSON.stringify(value));
    } else {
      localStorage.removeItem(settingKey);
    }
  }

  static getAdmin(key: AdminSetting) {
    return JSON.parse(localStorage.getItem(Storage.getAdminKey(key)) || "{}");
  }

  static triggerAdmin(key: AdminSetting) {
    const value = Storage.getAdmin(key);
    if (Object.keys(value).length > 0) {
      gameState.trigger(Storage.getAdminKey(key), value);
    }
  }
}
