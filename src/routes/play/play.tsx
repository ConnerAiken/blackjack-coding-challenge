import {
  useLazyDrawCardsQuery,
  useLazyAddToPileQuery,
  useLazyReturnCardsQuery,
  useLazyShuffleCardsQuery,
} from "../../services/blackjack";
import { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  GameResult,
  GameResultEnum,
  GameStatus,
  GameStatusEnum,
  PileTypeEnum,
  PlayingCard,
} from "../../types";
import historySlice from "../../redux/historySlice";
import { RootState, store } from "../../redux/store";
import "./play.scss";
import useSound from "use-sound";

import cardFanSfx from "./../../assets/effects/cardFan1.wav";
import cardPlaceSfx from "./../../assets/effects/cardPlace1.wav";
import awwSfx from "./../../assets/effects/aww.mp3";
import applauseSfx from "./../../assets/effects/applause.wav";
import gaspSfx from "./../../assets/effects/gasp.mp3";

import { usePreventClose } from "../../hooks/usePreventClose";
import handSlice from "../../redux/handSlice";

import PlayBG from "../../assets/img/play-bg.jpg";
import Dealer from "../../assets/img/dealer.jpg";
import Cloth from "../../assets/img/green-cloth.jpg";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";

import HandActions from "../../components/handActions/handActions";
import Rules from "../../components/rules/rules";
import Chat from "../../components/chat/chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { getTotalValue } from "../../utils";

interface DrawState {
  firstDraw: boolean;
  partialCards: PlayingCard[];
}

const Play = () => {
  usePreventClose();

  const [playCardFanSfx] = useSound(cardFanSfx);
  const [playCardPlaceSfx] = useSound(cardPlaceSfx);
  const [playAwwSfx, { stop: stopAwwSfx }] = useSound(awwSfx);
  const [playApplauseSfx, { stop: stopApplauseSfx }] = useSound(applauseSfx);
  const [playGaspSfx, { stop: stopGaspSfx }] = useSound(gaspSfx);

  const [drawTrigger, { isLoading: isFetchingCards }] = useLazyDrawCardsQuery();
  const [addToPileTrigger] = useLazyAddToPileQuery({});
  const [returnCardsTrigger] = useLazyReturnCardsQuery({});
  const [shuffleCardsTrigger] = useLazyShuffleCardsQuery({});

  const deckId = useSelector((state: RootState) => state.hand.deckId);
  const gameResult = useSelector((state: RootState) => state.hand.gameResult);
  const noneCards = useSelector((state: RootState) => state.hand.cards.none);
  const playerCards = useSelector((state: RootState) => state.hand.cards.player);
  const dealerCards = useSelector((state: RootState) => state.hand.cards.dealer);
  const gameStatus = useSelector((state: RootState) => state.hand.gameStatus as GameStatus);

  /**
   * ==========================
   * GAME LOGIC
   * ======================
   */
  const handleAudienceSfx = (gameResult: GameResult | boolean = false) => {
    if (!gameResult) {
      stopApplauseSfx();
      stopAwwSfx();
      stopGaspSfx();
      return;
    }

    if (gameResult === GameResultEnum.WIN) {
      playApplauseSfx();
    }
    if (gameResult === GameResultEnum.LOSE) {
      playAwwSfx();
    }
    if (gameResult === GameResultEnum.DRAW) {
      playGaspSfx();
    }
  };
  /**
   * This function handles the reshuffling of the deck when there are not enough cards left to complete a draw
   */
  const reshuffleDeck = async (callback: (drawInfo: DrawState) => void, drawInfo: DrawState) => {
    // Return all cards but the active dealer/player cards
    await returnCardsTrigger({ deck_id: deckId, pile: PileTypeEnum.NONE });
    await shuffleCardsTrigger({ deck_id: deckId });
    await callback(drawInfo);
  };

  /**
   * This function handles the player hitting their hand
   */
  const handleHitAction = async (drawInfo: DrawState) => {
    const drawCount = drawInfo.firstDraw ? 2 : 1;

    const { data: deckData } = await drawTrigger({ deck_id: deckId, card_count: drawCount }, false);
    const newCards = [...playerCards, ...deckData.cards, ...drawInfo.partialCards];

    // Add any cards returned at all (may be partial draw) to the player's pile
    await addToPileTrigger({
      player: PileTypeEnum.PLAYER,
      deck_id: deckId,
      cards: newCards,
    });

    if (deckData.cards.length < drawCount) {
      const isFirstDraw = drawCount === 2 && newCards.length === 0 ? true : false;
      await reshuffleDeck(handleHitAction, {
        firstDraw: isFirstDraw,
        partialCards: deckData.cards,
      });
      return;
    }

    store.dispatch(
      handSlice.actions.setGameInfo({
        cards: {
          dealer: dealerCards,
          player: newCards,
          none: noneCards,
        },
        deckId,
        remaining: deckData.remaining,
        gameStatus: GameStatusEnum.STARTED,
      }),
    );

    // Play sfx
    playCardPlaceSfx();
  };

  /**
   * This function handles the dealer drawing the initial hand
   */
  const drawHand = async (drawInfo: DrawState) => {
    const drawCount = drawInfo.firstDraw ? 2 : 1;

    // Determine card count
    const { data: deckData } = await drawTrigger({ deck_id: deckId, card_count: drawCount }, false);
    const newCards = [...dealerCards, ...deckData.cards, ...drawInfo.partialCards];

    // Add any cards returned at all (may be partial draw) to the dealer's pile
    await addToPileTrigger({
      player: PileTypeEnum.DEALER,
      deck_id: deckData.deck_id,
      cards: newCards,
    });

    if (deckData.cards.length < drawCount) {
      const isFirstDraw = drawCount === 2 && newCards.length === 0 ? true : false;
      await reshuffleDeck(drawHand, {
        firstDraw: isFirstDraw,
        partialCards: deckData.cards,
      });
      return;
    }

    // Dispatch all our updates
    store.dispatch(
      handSlice.actions.setGameInfo({
        cards: {
          dealer: newCards,
          player: playerCards,
          none: noneCards,
        },
        deckId: deckData.deck_id,
        remaining: deckData.remaining,
        gameStatus: GameStatusEnum.STARTED,
      }),
    );
  };

  /**
   * ===========================
   * HOOKS
   * =======================
   */
  // Handle the business logic for the game once the game status changes
  useEffect(() => {
    // Hit the dealer with the first two cards and commence the game
    if (gameStatus === GameStatusEnum.STARTING) {
      drawHand({
        firstDraw: true,
        partialCards: [],
      });

      setTimeout(() => {
        // Play sfx
        playCardFanSfx();
      }, 2500);
    }

    // Hit the player with the first two cards
    if (gameStatus === GameStatusEnum.STARTED) {
      handleHitAction({
        firstDraw: true,
        partialCards: [],
      });
    }

    if (gameStatus === GameStatusEnum.OVER) {
      store.dispatch(
        historySlice.actions.addHistory({
          result: gameResult || GameResultEnum.UNDETERMINED,
          deckId,
          dealerCards,
          playerTotal: getTotalValue(playerCards),
          playerCards,
          dealerTotal: getTotalValue(dealerCards),
          timestamp: new Date().toISOString(),
        }),
      );

      handleAudienceSfx(gameResult);

      setTimeout(async () => {
        handleAudienceSfx(false);

        await addToPileTrigger({
          player: PileTypeEnum.NONE,
          deck_id: deckId,
          cards: [...dealerCards, ...playerCards],
        });
        store.dispatch(handSlice.actions.resetGame());
      }, 2500);
    }
  }, [gameStatus]);

  return (
    <Container fluid id="play-route" style={{ backgroundImage: `url(${PlayBG})`, backgroundSize: "contain" }}>
      <Row>
        <Col style={{ height: "50vh" }}>
          <Row>
            <Col xs={4} style={{ height: "50vh" }}>
              <Card id="dealer-img-card">
                <Card.Header>
                  <Card.Title>Dealer</Card.Title>
                </Card.Header>
                <Card.Body
                  style={{
                    backgroundImage: `url(${Dealer})`,
                    backgroundSize: "cover",
                  }}
                />
              </Card>
            </Col>
            <Col xs={8} style={{ height: "50vh" }}>
              <Card>
                <Card.Header>
                  <Card.Title>House Cards</Card.Title>
                </Card.Header>
                <Card.Body
                  className="flex align-items-center justify-content-center"
                  style={{
                    backgroundImage: `url(${Cloth})`,
                    backgroundSize: "cover",
                  }}
                >
                  {gameStatus == GameStatusEnum.STARTING && (
                    <>
                      <Image
                        className="placeholder-card"
                        src={"https://www.deckofcardsapi.com/static/img/back.png"}
                        fluid
                      />
                      <Image
                        className="placeholder-card"
                        src={"https://www.deckofcardsapi.com/static/img/back.png"}
                        fluid
                      />
                    </>
                  )}
                  {gameStatus !== GameStatusEnum.STARTING ? (
                    dealerCards.map((card) => (
                      <Image key={card.code} className="displayed-card" src={card.image} fluid />
                    ))
                  ) : (
                    <></>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col style={{ height: "50vh" }}>
          <Row>
            <Col style={{ height: "50vh" }}>
              <Chat />
            </Col>
            <Col style={{ height: "50vh" }}>
              <Card id="rulesCard">
                <Card.Header>
                  <Card.Title>
                    <FontAwesomeIcon icon={faBook} />
                    &nbsp; Rules
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <Rules />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col style={{ height: "50vh" }} xs={9}>
          <Card id="yourCards">
            <Card.Header>
              <Card.Title>Your Cards</Card.Title>
            </Card.Header>
            <Card.Body
              className="flex align-items-center justify-content-start"
              style={{
                backgroundImage: `url(${Cloth})`,
                backgroundSize: "cover",
              }}
            >
              {playerCards.length > 0 ? (
                playerCards.map((card) => {
                  return (
                    <Fragment key={card.code}>
                      <img
                        src={card.image}
                        className="displayed-card"
                        style={{
                          maxWidth: (1 / playerCards.length) * 100 + "%",
                        }}
                      />
                    </Fragment>
                  );
                })
              ) : (
                <></>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col style={{ height: "50vh" }}>
          <HandActions
            isFetchingCards={isFetchingCards}
            onStay={() => {
              store.dispatch(handSlice.actions.stayOnHand());
            }}
            onHit={() => {
              handleHitAction({
                firstDraw: false,
                partialCards: [],
              });
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Play;
