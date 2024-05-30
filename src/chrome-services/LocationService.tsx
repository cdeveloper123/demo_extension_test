import React, { useCallback, useEffect } from 'react';
import { waitForElements } from './utils';

interface LocationServiceProps {
  onLocationDataProcessed: (mapUrls: string[]) => void;
}

const LocationService: React.FC<LocationServiceProps> = ({ onLocationDataProcessed }) => {
  const sendLoadLocations = useCallback(async (loadLocationsArray: string[][]) => {
    const baseUrl = process.env.REACT_APP_URL;

    const accessToken = process.env.REACT_APP_GOOGLE_API_KEY;

    const fields = 'places.displayName,places.location';

    const allLocationData: any[] = [];

    try {
      for (const locationsPair of loadLocationsArray) {

        const locationsDataPair: any[] = [];
        for (const location of locationsPair) {

          const response = await fetch(`${baseUrl}?fields=${fields}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
              'X-Goog-FieldMask': fields,
              'x-goog-user-project': 'plasma-canyon-296821'
            },
            body: JSON.stringify({ textQuery: location }),
          });


          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
          }

          const data = await response.json();
          locationsDataPair.push(data);
        }
        allLocationData.push(locationsDataPair);
      }
      return allLocationData;
    } catch (error) {
      console.error('Error sending load locations:', error);
      return null;
    }
  }, []);

  const processLocationData = useCallback((allLocationData: any[]): string[][] => {
    const locationsArray: string[][] = [];

    allLocationData.forEach((locationPair: any[]) => {
      const locations: string[] = locationPair.map(locationData => {
        const place = locationData.places[0];
        const location = place?.location;
        return `${location.latitude},${location.longitude}`;
      });
      locationsArray.push(locations);
    });

    return locationsArray;
  }, []);

  const generateMapUrl = useCallback((locationsArray: string[][]): string[] => {
    return locationsArray.map(locations => {
      const [origin, destination] = locations;
      return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    });
  }, []);

  useEffect(() => {
    const xpath = '(//tbody)[1]//a';
    waitForElements(xpath, (elements: HTMLElement[]) => {

      const loadLocationsArray: string[][] = [];

      if (elements.length > 0) {
        elements.forEach((element: HTMLElement) => {

          if (element instanceof HTMLElement) {
            const loadLocations = element.querySelectorAll('.index-module-loadLocation-pmPrI');

            const locationsPair: string[] = [];

            loadLocations.forEach((loadLocation) => {
              if (loadLocation instanceof HTMLElement) {
                locationsPair.push(loadLocation.innerText);
              }
            });

            loadLocationsArray.push(locationsPair);
          }
        });

        sendLoadLocations(loadLocationsArray).then(locationData => {
          if (locationData) {
            const processedLocationData = processLocationData(locationData);
            const mapUrls = generateMapUrl(processedLocationData);

            onLocationDataProcessed(mapUrls);
          }
        });
      } else {
        console.log('No matching elements found.');
      }
    });
  }, [generateMapUrl, processLocationData, sendLoadLocations, onLocationDataProcessed]);

  return null;
};

export default LocationService;
