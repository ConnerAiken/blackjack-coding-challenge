import Card from "react-bootstrap/Card";
import "./rules.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faHand,
  faHandPointDown,
  faInfoCircle,
  faPeopleGroup,
  faWandSparkles,
} from "@fortawesome/free-solid-svg-icons";

export default function Rules() {
  return (
    <>
      <Card.Text>
        <FontAwesomeIcon icon={faPeopleGroup} style={{ color: "white" }} /> The game consists of two players:
        You vs The House (the dealer).
      </Card.Text>
      <Card.Text>
        <FontAwesomeIcon icon={faBullseye} style={{ color: "red" }} /> The goal is to beat the House's hand,
        without going over 21.
      </Card.Text>
      <Card.Text>
        <FontAwesomeIcon icon={faInfoCircle} style={{ color: "white" }} /> A card contains a "point" value
        equivalent to it's number (the 3 of club is worth 3 points, the 9 of spades is worth 9 points). Face
        cards (Jack, Queen, King) are worth 10 points, and the Ace card is either worth 1 or 11, whichever is
        most helpful for the player's hand.
      </Card.Text>
      <Card.Text>
        <FontAwesomeIcon icon={faWandSparkles} style={{ color: "white" }} /> There are two moves you can make:{" "}
        <b>Hit</b> and <b>Stand</b>.
        <ul>
          <li>
            <FontAwesomeIcon icon={faHandPointDown} style={{ color: "white" }} />
            &nbsp;
            <b>Hit</b> means you want another card, &nbsp;
          </li>
          <li>
            <FontAwesomeIcon icon={faHand} style={{ color: "white" }} />
            &nbsp;
            <b>Stand</b> means you are satisfied with your hand.
          </li>
        </ul>
      </Card.Text>
    </>
  );
}
