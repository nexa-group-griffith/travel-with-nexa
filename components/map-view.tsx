'use client';

import { useState } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import Image from 'next/image';
import mapStyles from './mapStyles';

interface MapProps {
  places: {
    lat: number;
    lng: number;
    name: string;
    photoUrl: string;
  }[];
  width?: string;
  height?: string;
}

const MapView: React.FC<MapProps> = ({
  places,
  width = '100%',
  height = '500px',
}) => {
  const [selectedPlace, setSelectedPlace] = useState<
    MapProps['places'][0] | null
  >(null);

  const containerStyle = {
    width,
    height,
  };

  const center = places?.length ? places[0] : { lat: 0, lng: 0 };

  return (
    <div className='map-container'>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        options={{
          styles: mapStyles,
          streetViewControl: false,
          keyboardShortcuts: false,
          maxZoom: 20,
          minZoom: 1,
          tilt: 0,
        }}
      >
        {places.map((place, i) => (
          <Marker
            key={i}
            position={place}
            onClick={() => setSelectedPlace(place)}
          />
        ))}

        {selectedPlace && (
          <InfoWindow
            position={selectedPlace}
            onCloseClick={() => setSelectedPlace(null)}
            options={{
              pixelOffset: new window.google.maps.Size(0, -40),
            }}
          >
            <div
              className='info-window-content'
              style={{ userSelect: 'none', pointerEvents: 'none' }}
              onContextMenu={(e) => e.preventDefault()}
            >
              <h3 className='text-lg font-semibold mb-2 text-center'>
                {selectedPlace.name}
              </h3>
              <div className='relative w-full h-32 mb-2 rounded-md overflow-hidden'>
                <Image
                  src={selectedPlace.photoUrl}
                  alt={selectedPlace.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  draggable={false}
                />
              </div>
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lng}`,
                    '_blank'
                  )
                }
                className='w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors'
                style={{ pointerEvents: 'auto' }}
              >
                Get Directions
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;
