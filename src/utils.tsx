import { Suite } from "./types";
import { CardValueMap, CardValues, Code, PlayingCard } from "./types";

export const getTotalValue = (cards: PlayingCard[]) => {
  let total = 0;
  const aces = cards.filter((a) => a.value === "ACE");
  const otherCards = cards.filter((a) => a.value !== "ACE");

  // Move aces to the end so we always have a true total to compare against
  [...otherCards, ...aces].forEach((card) => {
    total += CardValueMap[card.value](total);
  });

  return total;
};

export const mockCard = (value: CardValues, suite: Suite): PlayingCard => {
  return {
    value,
    suite,
    code: `${value.slice(0, 1)}${suite.slice(0, 1)}`.toUpperCase() as Code,
    image: "",
    images: { svg: "", png: "" },
  };
};
