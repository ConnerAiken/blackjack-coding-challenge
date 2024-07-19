import { getTotalValue, mockCard } from "./utils";

describe("Calculation logic of cards", () => {
  describe("When calculating the total value of cards..", () => {
    it("should return 21 for a blackjack hand", () => {
      const total = getTotalValue([mockCard("ACE", "CLUBS"), mockCard("KING", "HEARTS")]);

      expect(total).toEqual(21);
    });

    it("should return 20 for two face cards", () => {
      const total = getTotalValue([mockCard("QUEEN", "CLUBS"), mockCard("KING", "HEARTS")]);

      expect(total).toEqual(20);
    });

    it("should treat ace as a high when advantageous", () => {
      const total = getTotalValue([mockCard("ACE", "CLUBS"), mockCard("2", "HEARTS")]);

      expect(total).toEqual(13);
    });

    it("should treat ace as a low when advantageous", () => {
      const total = getTotalValue([
        mockCard("KING", "CLUBS"),
        mockCard("2", "HEARTS"),
        mockCard("ACE", "CLUBS"),
      ]);

      expect(total).toEqual(13);
    });

    it("should treat ace as a low when advantageous and multiple aces are present", () => {
      const total = getTotalValue([
        mockCard("KING", "CLUBS"),
        mockCard("2", "HEARTS"),
        mockCard("ACE", "CLUBS"),
        mockCard("ACE", "CLUBS"),
      ]);

      expect(total).toEqual(14);
    });

    it("should treat multiple aces as a high and a low when advantageous", () => {
      const total = getTotalValue([
        mockCard("5", "CLUBS"),
        mockCard("2", "HEARTS"),
        mockCard("ACE", "CLUBS"),
        mockCard("ACE", "CLUBS"),
      ]);

      expect(total).toEqual(19);
    });
  });
});
