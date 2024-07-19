import Card from "react-bootstrap/Card";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useEffect, useLayoutEffect, useState } from "react";
import ChatBot from "./chatBot";
import Image from "react-bootstrap/Image";
import DealerProfile from "./../../assets/img/dealer-profile.png";
import "./chat.scss";

export type ChatMessage = {
  timestamp: string;
  body: string;
};

export default function Chat() {
  const history = useSelector((state: RootState) => state.history);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      timestamp: "none",
      body: ChatBot.greet(),
    },
  ]);

  // Remove the welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages((currentMessages) => currentMessages.filter((message) => message.timestamp !== "none"));
    }, 30000);

    // Avoid stale state issues
    return () => clearTimeout(timer);
  }, []);

  // As games are played, the chat bot will respond to the results
  useEffect(() => {
    if (history.length > 0) {
      const lastGame = history[history.length - 1];
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          timestamp: lastGame.timestamp,
          body: ChatBot.respond(lastGame.result),
        },
      ]);

      const timer = setTimeout(() => {
        setMessages((currentMessages) =>
          currentMessages.filter((message) => message.timestamp !== lastGame.timestamp),
        );
      }, 30000);

      // Avoid stale state issues
      return () => clearTimeout(timer);
    }
  }, [history]);

  // Auto-scroll to end of chat box on re-render
  useLayoutEffect(() => {
    const chatBox = document.getElementById("chatBox");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });

  return (
    <Card id="chatCard">
      <Card.Header>
        <Card.Title>
          <i className="pi pi-comments" style={{ fontSize: "1.25rem" }} />
          &nbsp; Chat
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <div id="chatBox" className="chatBox">
          {messages.map((message) => {
            return (
              <div
                key={message.timestamp}
                className="flex justify-content-start align-items-center chatMessage"
              >
                <div className="chatAuthor">
                  <Image roundedCircle src={DealerProfile} style={{ height: "5vh" }} fluid />
                </div>
                <div className="chatBody">{message.body}</div>
              </div>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
}
