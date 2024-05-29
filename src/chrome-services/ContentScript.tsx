import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import MessageListener from './MessageListener';
import TableManipulation from './TableManipulation';
import LocationService from './LocationService';

const ContentScript: React.FC = () => {
  const [mapUrls, setMapUrls] = useState<string[]>([]);

  return (
    <>
      <MessageListener
        addTableHeaderField={() => {}}
        observeTable={setMapUrls}
      />
      <LocationService
        onLocationDataProcessed={setMapUrls}
      />
      <TableManipulation mapUrls={mapUrls} />
    </>
  );
};

export const initializeContentScript = () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  createRoot(root).render(<ContentScript />);
};
