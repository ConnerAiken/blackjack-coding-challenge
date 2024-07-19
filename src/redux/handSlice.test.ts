import { initialState, HandState, determineHandStatus, stayOnHand } from "./handSlice";
import { GameResultEnum, GameStatusEnum } from "../types";
import { mockCard } from "../utils";

describe("Business logic of front-end", () => {
  describe("When a game completes..", () => {
    test("We should win with a blackjack hand", () => {
      const state: HandState = {
        ...initialState,
        cards: {
          none: [],
          dealer: [mockCard("8", "DIAMONDS"), mockCard("2", "HEARTS")],
          player: [mockCard("JACK", "CLUBS"), mockCard("ACE", "HEARTS")],
        },
      };

      // Apply state
      determineHandStatus(state);

      // Validate conditions
      expect(state.gameStatus).toEqual(GameStatusEnum.OVER);
      expect(state.gameResult).toEqual(GameResultEnum.WIN);
    });

    test("We should lose if the dealer blackjacks", () => {
      const state: HandState = {
        ...initialState,
        cards: {
          none: [],
          dealer: [mockCard("JACK", "CLUBS"), mockCard("ACE", "HEARTS")],
          player: [mockCard("8", "DIAMONDS"), mockCard("2", "HEARTS")],
        },
      };

      // Apply state
      determineHandStatus(state);

      // Validate conditions
      expect(state.gameStatus).toEqual(GameStatusEnum.OVER);
      expect(state.gameResult).toEqual(GameResultEnum.LOSE);
    });

    test("We should be allowed to continue the game if nobody got a blackjack", () => {
      const state: HandState = {
        ...initialState,
        gameStatus: GameStatusEnum.STARTED,
        cards: {
          none: [],
          dealer: [mockCard("JACK", "CLUBS"), mockCard("3", "HEARTS")],
          player: [mockCard("8", "DIAMONDS"), mockCard("2", "HEARTS")],
        },
      };

      // Apply state
      determineHandStatus(state);

      // Validate conditions
      expect(state.gameStatus).toEqual(GameStatusEnum.STARTED);
      expect(state.gameResult).toEqual(GameResultEnum.UNDETERMINED);
    });
  });

  describe("When we stay on a hand..", () => {
    test("We should lose if we have a typical losing hand", () => {
      const state: HandState = {
        ...initialState,
        cards: {
          none: [],
          dealer: [mockCard("JACK", "CLUBS"), mockCard("4", "HEARTS")],
          player: [mockCard("10", "DIAMONDS"), mockCard("2", "HEARTS")],
        },
      };

      // Apply state
      stayOnHand(state);

      // Validate conditions
      expect(state.gameStatus).toEqual(GameStatusEnum.OVER);
      expect(state.gameResult).toEqual(GameResultEnum.LOSE);
    });

    test("We should win if we have a typical winning hand", () => {
      const state: HandState = {
        ...initialState,
        cards: {
          none: [],
          dealer: [mockCard("JACK", "CLUBS"), mockCard("2", "HEARTS")],
          player: [mockCard("10", "DIAMONDS"), mockCard("10", "HEARTS")],
        },
      };

      // Apply state
      stayOnHand(state);

      // Validate conditions
      expect(state.gameStatus).toEqual(GameStatusEnum.OVER);
      expect(state.gameResult).toEqual(GameResultEnum.WIN);
    });

    test("The game should handle an ace when it's the last card (running total)", () => {
      const state: HandState = {
        ...initialState,
        cards: {
          none: [],
          dealer: [mockCard("10", "DIAMONDS"), mockCard("2", "HEARTS")],
          player: [mockCard("KING", "HEARTS"), mockCard("ACE", "CLUBS")],
        },
      };

      // Apply state
      stayOnHand(state);

      // Validate conditions
      expect(state.gameStatus).toEqual(GameStatusEnum.OVER);
      expect(state.gameResult).toEqual(GameResultEnum.WIN);
    });

    test("The game should handle an ace when it's the first card", () => {
      const state: HandState = {
        ...initialState,
        cards: {
          none: [],
          dealer: [mockCard("10", "DIAMONDS"), mockCard("2", "HEARTS")],
          player: [mockCard("ACE", "CLUBS"), mockCard("2", "HEARTS"), mockCard("4", "HEARTS")],
        },
      };

      // Apply state
      stayOnHand(state);

      // Validate conditions
      expect(state.gameStatus).toEqual(GameStatusEnum.OVER);
      expect(state.gameResult).toEqual(GameResultEnum.WIN);
    });

    // test("The game should handle multiple aces", () => {
    //   const state: HandState = {
    //     ...initialState,
    //     cards: {
    //       none: [],
    //       dealer: [mockCard("10", "DIAMONDS"), mockCard("6", "HEARTS")],
    //       player: [mockCard("ACE", "CLUBS"), mockCard("4", "HEARTS"), mockCard("ACE", "HEARTS")],
    //     },
    //   };

    //   // Apply state
    //   stayOnHand(state);

    //   // Validate conditions
    //   expect(state.gameStatus).toEqual(GameStatusEnum.OVER);
    //   expect(state.gameResult).toEqual(GameResultEnum.WIN);
    // });
  });
});
