import React, { useCallback, useEffect } from 'react';
import { ChromeMessage, Sender } from '../types';

interface MessageListenerProps {
  addTableHeaderField: () => void;
  observeTable: (mapUrls: string[]) => void;
}

const MessageListener: React.FC<MessageListenerProps> = ({ addTableHeaderField, observeTable }) => {
  const validateSender = useCallback((message: ChromeMessage, sender: chrome.runtime.MessageSender) => {
    return sender.id === chrome.runtime.id && message.from === Sender.React;
  }, []);

  const messagesFromReactAppListener = useCallback((message: ChromeMessage, sender: chrome.runtime.MessageSender, response: (response?: any) => void) => {
    const isValidated = validateSender(message, sender);

    if (isValidated && message.message === 'Hello from React') {
      response('Hello from content.js');
    }

    if (isValidated && message.message === 'delete logo') {
      const logo = document.getElementById('hplogo');
      logo?.parentElement?.removeChild(logo);
    }
  }, [validateSender]);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messagesFromReactAppListener);
    };
  }, [messagesFromReactAppListener]);

  return null;
};

export default MessageListener;
