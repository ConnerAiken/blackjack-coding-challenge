import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { GameResultEnum, GameStatusEnum, SetDealerCardsPayload } from "../types";
import { PlayingCard } from "../types";
import { getTotalValue } from "../utils";

export interface HandState {
  deckId: string;
  remaining: number;
  partialCards: PlayingCard[];
  cards: {
    player: PlayingCard[];
    dealer: PlayingCard[];
    none?: PlayingCard[];
  };
  firstDraw: boolean;
  gameStatus: GameStatusEnum;
  gameResult?: GameResultEnum;
}

export const initialState: HandState = {
  deckId: "new",
  partialCards: [],
  cards: {
    dealer: [],
    player: [],
    none: [],
  },
  remaining: 0,
  firstDraw: true,
  gameStatus: GameStatusEnum.STARTING,
  gameResult: GameResultEnum.UNDETERMINED,
};

/**
 * This function determines if the game is in a win, loss or tie state once the game automatically ends
 * @param state
 */
export const determineHandStatus = (state: HandState) => {
  let dealerTotal = getTotalValue(state.cards.dealer);
  let playerTotal = getTotalValue(state.cards.player);

  // Since we are not staying, we should allow play to continue until someone is > 21
  if (dealerTotal < 21 && playerTotal < 21) {
    return;
  }

  // If the dealer busted or the player has 21, the player wins
  if (dealerTotal > 21 || playerTotal == 21) {
    state.gameStatus = GameStatusEnum.OVER;
    state.gameResult = GameResultEnum.WIN;
    return;
  }

  // If the player busted or the dealer has 21, the player loses
  if (playerTotal > 21 || dealerTotal == 21) {
    state.gameStatus = GameStatusEnum.OVER;
    state.gameResult = GameResultEnum.LOSE;
    return;
  }

  // If the dealer and player have the same total, it's a draw
  if (dealerTotal == playerTotal) {
    state.gameStatus = GameStatusEnum.OVER;
    state.gameResult = GameResultEnum.DRAW;
  }
};

/**
 * This function handles the stay action, determining if we should win/lose/tie
 * @param state
 */
export const stayOnHand = (state: HandState) => {
  state.gameStatus = GameStatusEnum.OVER;
  state.gameResult =
    getTotalValue(state.cards.player) > getTotalValue(state.cards.dealer)
      ? GameResultEnum.WIN
      : GameResultEnum.LOSE;
};

const handSlice = createSlice({
  name: "hand",
  initialState,
  reducers: {
    /**
     * This functionsets the majority of the game information state
     * @param state
     * @param action
     */
    setGameInfo: (state, action: PayloadAction<any>) => {
      state.deckId = action.payload.deckId;
      state.remaining = action.payload.remaining;
      state.cards.player = action.payload.cards.player;
      state.cards.dealer = action.payload.cards.dealer;
      state.cards.none = action.payload.cards.none;
      state.gameStatus = action.payload.gameStatus;

      // Check to see if the dealer drew a blackjack
      determineHandStatus(state);
    },
    /**
     * This function sets the card state for individual roles
     * @param state
     * @param action
     */
    setCards: (state, action: PayloadAction<SetDealerCardsPayload>) => {
      state.cards[action.payload.role] = [
        ...(state.cards[action.payload.role] || []),
        ...state.partialCards,
        ...action.payload.cards,
      ];
    },
    /**
     * This function sets the remaining deck card count
     * @param state
     * @param action
     */
    setDeckRemaining: (state, action: PayloadAction<number>) => {
      state.remaining = action.payload;
    },
    /**
     * This function sets the deck id
     * @param state
     * @param action
     */
    setDeckId: (state, action: PayloadAction<string>) => {
      state.deckId = action.payload;
    },
    /**
     * This function sets the game status (win, lose, tie)
     * @param state
     * @param action
     */
    setGameStatus: (state, action: PayloadAction<GameStatusEnum>) => {
      state.gameStatus = action.payload;
    },
    /**
     * This function resets the state back to the start of the game
     * @param state
     */
    resetGame: (state) => {
      state = {
        ...initialState,
        deckId: state.deckId,
      };

      return state;
    },

    // Tested functions
    determineHandStatus,
    stayOnHand,
  },
});

export default handSlice;
