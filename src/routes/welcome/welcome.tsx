import { useNavigate } from "react-router-dom";
import BG1 from "../../assets/img/bg-1.jpg";
import useSound from "use-sound";
import welcomeSfx from "./../../assets/music/welcome.wav";
import gameplaySfx from "./../../assets/music/gameplay.mp3";
import { useEffect, useState } from "react";
import Dealer from "../../assets/img/dealer.jpg";
import Image from "react-bootstrap/Image";
import { Button, Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Rules from "../../components/rules/rules";

const Welcome = () => {
  const navigate = useNavigate();
  const [playWelcomeMusic, { stop: stopWelcomeMusic }] = useSound(welcomeSfx);
  const [playGameplayMusic] = useSound(gameplaySfx, {
    volume: 0.1,
    onend: () => {
      playGameplayMusic();
    },
  });
  const [userPromptedForPermission, setUserPromptedForPermission] =
    useState(false);

  const handleStartGame = () => {
    stopWelcomeMusic();
    playGameplayMusic();
    navigate("/play");
  };

  useEffect(() => {
    playWelcomeMusic();
  }, [userPromptedForPermission]);

  return (
    <>
      <Container
        id="welcome-route"
        className="h-screen flex align-items-center justify-content-center"
        fluid
        style={{
          backgroundImage: `url(${BG1})`,
          backgroundSize: "cover",
        }}
      >
        <Image src={Dealer} style={{ height: "30em" }} />

        <Card style={{ height: "30em", width: "40em", borderRadius: 0 }}>
          <Card.Header>
            <Card.Title className="text-center">
              Welcome to Blackjack!
            </Card.Title>
          </Card.Header>
          <Card.Body>
            {userPromptedForPermission && (
              <>
                <Card.Text>
                  This game is a digital version of the popular card game
                  Blackjack.
                </Card.Text>
                <hr />
                <Rules />
              </>
            )}
            {!userPromptedForPermission && (
              <div
                className="flex flex-column justify-content-center align-items-center"
                style={{ height: "100%", padding: "5%" }}
              >
                <Card.Text>
                  This game utilizes sounds, please enable sound in your browser
                  to enjoy the full experience.
                </Card.Text>
                <div className="flex justify-content-center">
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (!userPromptedForPermission) {
                        setUserPromptedForPermission(true);
                      }
                    }}
                  >
                    Acknowledge
                  </Button>
                </div>
              </div>
            )}
          </Card.Body>
          {userPromptedForPermission && (
            <Card.Footer className="flex justify-content-center">
              <Button variant={"success"} onClick={handleStartGame}>
                Start Game
              </Button>
            </Card.Footer>
          )}
        </Card>
      </Container>
    </>
  );
};

export default Welcome;
