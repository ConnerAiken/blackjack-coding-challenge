import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { GameResultEnum, GameStatusEnum } from "../../types";
import "./handActions.scss";
import { Button, Card, ProgressBar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHand, faHandPointDown, faSquare, faWandSparkles } from "@fortawesome/free-solid-svg-icons";
import { getTotalValue } from "../../utils";

interface HandActionsProps {
  isFetchingCards: boolean;
  onStay: () => void;
  onHit: () => void;
}
export default function HandActions(props: HandActionsProps) {
  const history = useSelector((state: RootState) => state.history);
  const playerCards = useSelector((state: RootState) => state.hand.cards.player);
  const dealerCards = useSelector((state: RootState) => state.hand.cards.dealer);
  const gameStatus = useSelector((state: RootState) => state.hand.gameStatus);
  const wins = history.filter((game) => game.result === GameResultEnum.WIN).length;
  const losses = history.filter((game) => game.result === GameResultEnum.LOSE).length;
  const ties = history.filter((game) => game.result === GameResultEnum.DRAW).length;

  /**
   * Gets the win/lose/tie percentage
   * @param type Expects the length of 'losses', 'wins', or 'ties'
   * @returns
   */
  const getRatePercentage = (type: number) => {
    const totalGames = wins + losses + ties;

    if (totalGames === 0) {
      return 0;
    }

    return (type / totalGames) * 100;
  };

  return (
    <Card id="handActions">
      <Card.Header>
        <Card.Title>
          <FontAwesomeIcon icon={faWandSparkles} style={{ color: "white" }} />
          &nbsp; Make your pick
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          (Wins:&nbsp;
          <FontAwesomeIcon icon={faSquare} className="win-legend" />
          ,&nbsp;Losses:&nbsp;
          <FontAwesomeIcon icon={faSquare} className="loss-legend" />
          ,&nbsp;Ties:&nbsp;
          <FontAwesomeIcon icon={faSquare} className="tie-legend" />)
        </Card.Text>
        <ProgressBar>
          <ProgressBar
            striped
            animated
            variant="success"
            label={`${getRatePercentage(wins).toFixed(0)}%`}
            now={getRatePercentage(wins)}
            key={1}
          />
          <ProgressBar
            striped
            animated
            variant="danger"
            label={`${getRatePercentage(losses).toFixed(0)}%`}
            now={getRatePercentage(losses)}
            key={2}
          />
          <ProgressBar
            striped
            animated
            variant="info"
            label={`${getRatePercentage(ties).toFixed(0)}%`}
            now={getRatePercentage(ties)}
            key={3}
          />
        </ProgressBar>
        <hr />
        <Card.Text>Once the dealer has dealt, it is your turn to play.</Card.Text>
        <Card.Text>
          <b> Dealer Total: {getTotalValue(dealerCards)}</b>
          <br />
          <b> Your Total: {getTotalValue(playerCards)}</b>
          <br />
        </Card.Text>
      </Card.Body>
      <Card.Footer className="flex justify-content-between align-items-center">
        <Button
          className="action-btn"
          variant="success"
          onClick={props.onHit}
          disabled={
            gameStatus === GameStatusEnum.STARTING ||
            gameStatus === GameStatusEnum.OVER ||
            props.isFetchingCards
          }
        >
          <FontAwesomeIcon icon={faHandPointDown} style={{ color: "white" }} />
          &nbsp; Hit
        </Button>
        <Button
          className="action-btn"
          variant="primary"
          onClick={props.onStay}
          disabled={
            gameStatus === GameStatusEnum.STARTING ||
            gameStatus === GameStatusEnum.OVER ||
            props.isFetchingCards
          }
        >
          <FontAwesomeIcon icon={faHand} style={{ color: "white" }} />
          &nbsp; Stay
        </Button>
      </Card.Footer>
    </Card>
  );
}
