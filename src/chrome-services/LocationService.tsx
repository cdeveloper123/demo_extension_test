import React, { useCallback, useEffect } from 'react';
import { waitForElements } from './utils';

interface LocationServiceProps {
  onLocationDataProcessed: (mapUrls: string[]) => void;
}

const LocationService: React.FC<LocationServiceProps> = ({ onLocationDataProcessed }) => {
  const sendLoadLocations = useCallback(async (loadLocationsArray: string[][]) => {
    const baseUrl = process.env.REACT_APP_URL;
    console.log('---------------baseUrl--------------', baseUrl);

    const accessToken = process.env.REACT_APP_GOOGLE_API_KEY;
    console.log('---------------accessToken--------------', accessToken);

    const fields = 'places.displayName,places.location';

    const allLocationData: any[] = [];

    try {
      for (const locationsPair of loadLocationsArray) {
    console.log('---------------locationsPair--------------', locationsPair);

        const locationsDataPair: any[] = [];
        for (const location of locationsPair) {
    console.log('---------------${baseUrl}--------------', `Bearer ${accessToken}`);

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

          console.log('---------------response--------------', response);

          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
          }

          const data = await response.json();
          console.log('Response data:', data);
          locationsDataPair.push(data);
        }
        allLocationData.push(locationsDataPair);
      }
      console.log('All Location Data:', allLocationData);
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
      console.log(elements);

      const loadLocationsArray: string[][] = [];

      if (elements.length > 0) {
        elements.forEach((element: HTMLElement) => {
          console.log('---------------element--------------', element);

          if (element instanceof HTMLElement) {
            const loadLocations = element.querySelectorAll('.index-module-loadLocation-pmPrI');
            console.log('-------------------loadLocations---------------------');
            console.log(loadLocations);

            const locationsPair: string[] = [];

            loadLocations.forEach((loadLocation) => {
              if (loadLocation instanceof HTMLElement) {
                console.log(loadLocation.innerText);
                locationsPair.push(loadLocation.innerText);
              }
            });

            loadLocationsArray.push(locationsPair);
          }
        });

        console.log('Load Locations Array:', loadLocationsArray);

        sendLoadLocations(loadLocationsArray).then(locationData => {
          console.log('Fetched Location Data:', locationData);
          if (locationData) {
            const processedLocationData = processLocationData(locationData);
            const mapUrls = generateMapUrl(processedLocationData);
            console.log('Map Urls:', mapUrls);

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
