import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [mapUrls, setMapUrls] = useState<string[]>([]);

  useEffect(() => {
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.from === "content" && message.mapUrls) {
        setMapUrls(message.mapUrls);
      }
    });

    // Send a message to the content script to fetch the map URLs
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "getMapUrls" });
      }
    });
  }, []);

  const handleClick = (url: string) => {
    chrome.tabs.create({ url });
  };

  return (
    <div>
      <h1>Route Links</h1>
      <ul>
        {mapUrls.map((url, index) => (
          <li key={index}>
            <button onClick={() => handleClick(url)}>View Route</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
