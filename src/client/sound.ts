import "better-queue-memory";
import Queue from "better-queue";
import MemoryStore from "better-queue-memory";
import { Howl, Howler } from "howler";

let maxMusicVolume = 0.8;
let maxSFXVolume = 0.8;

const decks: Array<Howl | null> = [];
let activeDeck = 0;

const musicQueue = new Queue(
  ({ deck, fadeSpeed }, cb) => {
    const otherDeck = activeDeck ? 0 : 1;
    decks[otherDeck] = deck;
    decks[otherDeck]?.play();
    decks[otherDeck]?.fade(0, maxMusicVolume, fadeSpeed);
    decks[activeDeck]?.fade(maxMusicVolume, 0, fadeSpeed);
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
  const sound = new Howl({
    src: [fileName],
    volume: maxSFXVolume,
    autoplay: true,
  });
};

export const setMusicVolume = (input: number) => {
  maxMusicVolume = input;
  decks.forEach((deck) => deck?.volume(input));
};

export const setSoundVolume = (input: number) => {
  maxSFXVolume = input;
};
