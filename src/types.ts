export type CardValueMap = {
  [K in CardValues]: (value: number) => number;
};

export const CardValueMap: CardValueMap = {
  ACE: (value: number) => (value + 11 <= 21 ? 11 : 1),
  2: () => 2,
  3: () => 3,
  4: () => 4,
  5: () => 5,
  6: () => 6,
  7: () => 7,
  8: () => 8,
  9: () => 9,
  10: () => 10,
  JACK: () => 10,
  QUEEN: () => 10,
  KING: () => 10,
};

export type CardValues =
  | "ACE"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "JACK"
  | "QUEEN"
  | "KING";

export type Code =
  | "AS"
  | "AH"
  | "AD"
  | "AC"
  | "2S"
  | "2H"
  | "2D"
  | "2C"
  | "3S"
  | "3H"
  | "3D"
  | "3C"
  | "4S"
  | "4H"
  | "4D"
  | "4C"
  | "5S"
  | "5H"
  | "5D"
  | "5C"
  | "6S"
  | "6H"
  | "6D"
  | "6C"
  | "7S"
  | "7H"
  | "7D"
  | "7C"
  | "8S"
  | "8H"
  | "8D"
  | "8C"
  | "9S"
  | "9H"
  | "9D"
  | "9C"
  | "10S"
  | "10H"
  | "10D"
  | "10C"
  | "JS"
  | "JH"
  | "JD"
  | "JC"
  | "QS"
  | "QH"
  | "QD"
  | "QC"
  | "KS"
  | "KH"
  | "KD"
  | "KC";

export type Suite = "SPADES" | "HEARTS" | "DIAMONDS" | "CLUBS";
export type PlayingCard = {
  image: string;
  value: CardValues;
  suite: Suite;
  code: Code;
  images: {
    svg: string;
    png: string;
  };
};

export interface SetDealerCardsPayload {
  cards: PlayingCard[];
  role: "dealer" | "player" | "none";
}

export type GameStatus = "over" | "started" | "starting";
export enum GameStatusEnum {
  OVER = "over",
  STARTED = "started",
  STARTING = "starting",
}

export type GameResult = "win" | "lose" | "draw" | "undetermined";
export enum GameResultEnum {
  WIN = "win",
  LOSE = "lose",
  DRAW = "draw",
  UNDETERMINED = "undetermined",
}
export interface GameClassMap {
  [key: string]: "game-in-progress" | "game-over-win" | "game-over-loss" | "game-over-draw";
}

export type PileType = "player" | "dealer" | "none";
export enum PileTypeEnum {
  PLAYER = "player",
  DEALER = "dealer",
  NONE = "none",
}

export type HistoryState = HistoryItem[];
export interface HistoryItem {
  deckId: string;
  playerCards: PlayingCard[];
  playerTotal: number;
  dealerCards: PlayingCard[];
  dealerTotal: number;
  result: GameResultEnum;
  timestamp: string;
}
