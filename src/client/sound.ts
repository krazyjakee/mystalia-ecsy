import "better-queue-memory";
import Queue from "better-queue";
import MemoryStore from "better-queue-memory";
import { Howl } from "howler";
import Storage from "@client/utilities/storage";

const decks: Array<Howl | null> = [];
let activeDeck = 0;

const musicQueue = new Queue(
  ({ deck, fadeSpeed }, cb) => {
    const otherDeck = activeDeck ? 0 : 1;
    decks[otherDeck] = deck;
    decks[otherDeck]?.play();
    decks[otherDeck]?.fade(0, getMusicVolume(), fadeSpeed);
    decks[activeDeck]?.fade(getSoundVolume(), 0, fadeSpeed);
    setTimeout(() => {
      decks[activeDeck]?.stop();
      decks[activeDeck] = null;
      activeDeck = otherDeck;
      cb();
    }, fadeSpeed);
  },
  { store: new MemoryStore() }
);

export const playMusic = (fileName: string, fadeSpeed = 2000) => {
  if (!fileName) return;

  const deck = new Howl({
    src: [fileName],
    loop: true,
  });
  musicQueue.push({
    deck,
    fadeSpeed,
  });
};

export const playSound = (fileName: string) => {
  new Howl({
    src: [fileName],
    volume: getSoundVolume(),
    autoplay: true,
  });
};

export const setMusicVolume = (input: number) => {
  Storage.set("musicVolume", input);
  decks.forEach((deck) => deck?.volume(input));
};

export const setSoundVolume = (input: number) => {
  Storage.set("sfxVolume", input);
};

export const getMusicVolume = () =>
  parseFloat(Storage.get("musicVolume") || "0.8");
export const getSoundVolume = () =>
  parseFloat(Storage.get("sfxVolume") || "0.8");
