import { GameResultEnum } from "../../types";

// Strongly typed chatPhrases with Scenario enum as keys
const chatPhrases: { [key in GameResultEnum]: string[] } = {
  [GameResultEnum.WIN]: [
    "Congratulations!",
    "You've won, well played!",
    "Winner, winner, chicken dinner!",
    "You beat the house!",
    "That's a win. Nice job!",
    "You've got the magic touch!",
  ],
  [GameResultEnum.LOSE]: [
    "House wins this time.",
    "Tough luck, the house takes it.",
    "Sorry, you've lost this round.",
    "Better luck next hand.",
    "The cards weren't in your favor.",
    "Looks like it's not your day.",
    "The house always has the edge.",
    "You'll get them next time.",
  ],
  [GameResultEnum.DRAW]: [
    "It's a push, nobody wins.",
    "A tie! How about another round?",
    "Draw! The stakes remain.",
    "It's a standoff, try again?",
    "Equal footing, let's see who wins next.",
    "A tie, rare as it is, happens.",
  ],
  [GameResultEnum.UNDETERMINED]: [],
};

// Interface for the chat bot
interface ChatBot {
  respond: (scenario: GameResultEnum) => string;
  greet: () => string;
}

const chatBot: ChatBot = {
  respond: (scenario: GameResultEnum) => {
    const phrases = chatPhrases[scenario];
    return phrases[Math.floor(Math.random() * phrases.length)];
  },
  greet: () => "Hello! Care to join the table?",
};

export default chatBot;
