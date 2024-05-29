import { ChromeMessage, Sender } from "../types";
import { initializeContentScript } from "../chrome-services/ContentScript";

type MessageResponse = (response?: any) => void;

const validateSender = (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender
) => {
  return sender.id === chrome.runtime.id && message.from === Sender.React;
};

const messagesFromReactAppListener = (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender,
  response: MessageResponse
) => {
  const isValidated = validateSender(message, sender);

  if (isValidated && message.message === "Hello from React") {
    response("Hello from content.js");
  }

  if (isValidated && message.message === "delete logo") {
    const logo = document.getElementById("hplogo");
    logo?.parentElement?.removeChild(logo);
  }
};

// const main = () => {
//   console.log("[content.ts] Main");

  // chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

  window.addEventListener("load", () => {
    console.log("Content script works!");
    console.log("Must reload extension for modifications to take effect.");
    // ContentScript.initialize();
    initializeContentScript()
  });
// };

// main();
