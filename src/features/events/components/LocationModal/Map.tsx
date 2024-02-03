import 'leaflet/dist/leaflet.css';
import Fuse from 'fuse.js';
import { renderToStaticMarkup } from 'react-dom/server';
import { FC, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

import BasicMarker from './BasicMarker';
import SelectedMarker from './SelectedMarker';
import { useTheme } from '@mui/material';
import {
  divIcon,
  latLngBounds,
  Map as MapType,
  Marker as MarkerType,
} from 'leaflet';
import { ZetkinEvent, ZetkinLocation } from 'utils/types/zetkin';

interface MapProps {
  currentEventId: number;
  inMoveState: boolean;
  locations: ZetkinLocation[];
  onMapClick: (latlng: Pick<ZetkinLocation, 'lat' | 'lng'>) => void;
  onMarkerClick: (locationId: number) => void;
  onMarkerDragEnd: (lat: number, lng: number) => void;
  pendingLocation: Pick<ZetkinLocation, 'lat' | 'lng'> | null;
  relatedEvents: ZetkinEvent[];
  searchString: string;
  selectedLocation?: ZetkinLocation;
}

const MapWrapper = ({
  children,
}: {
  children: (map: MapType) => JSX.Element;
}) => {
  const map = useMap();
  return children(map);
};

const Map: FC<MapProps> = ({
  currentEventId,
  inMoveState,
  locations,
  onMapClick,
  onMarkerClick,
  onMarkerDragEnd,
  pendingLocation,
  relatedEvents,
  selectedLocation,
  searchString,
}) => {
  const theme = useTheme();
  const [newPosition, setNewPosition] = useState<Pick<
    ZetkinLocation,
    'lat' | 'lng'
  > | null>(null);

  const selectedMarkerRef = useRef<MarkerType>(null);

  const fuse = new Fuse(locations, {
    keys: ['title'],
    threshold: 0.4,
  });

  const filteredLocations = searchString
    ? fuse.search(searchString).map((fuseResult) => fuseResult.item)
    : locations;

  //if org doesn't have locations, show whole world
  const bounds =
    locations.length > 0
      ? latLngBounds(locations.map((location) => [location.lat, location.lng]))
      : latLngBounds([
          [75, -170],
          [-60, 180],
        ]);

  return (
    <MapContainer
      bounds={
        selectedLocation
          ? latLngBounds([[selectedLocation.lat, selectedLocation.lng]])
          : bounds
      }
      style={{ height: '80vh', width: '100%' }}
    >
      <MapWrapper>
        {(map) => {
          if (selectedLocation) {
            map.setView(
              { lat: selectedLocation.lat, lng: selectedLocation.lng },
              17
            );
          }

          if (pendingLocation) {
            map.setView(
              { lat: pendingLocation.lat, lng: pendingLocation.lng },
              17
            );
          }

          map.on('click', (evt) => {
            const lat = evt.latlng.lat;
            const lng = evt.latlng.lng;

            onMapClick({ lat, lng });
          });

          return (
            <>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredLocations.map((location) => {
                const isSelectedMarker = selectedLocation?.id == location.id;
                const noOfRelevantEvents = relatedEvents.filter(
                  (event) =>
                    event.location?.id === location.id &&
                    event.id !== currentEventId
                ).length;
                return (
                  <Marker
                    key={location.id}
                    ref={
                      inMoveState && isSelectedMarker ? selectedMarkerRef : null
                    }
                    draggable={inMoveState && isSelectedMarker}
                    eventHandlers={{
                      click: (evt) => {
                        evt.originalEvent.stopPropagation();
                        setNewPosition(null);
                        map.setView(evt.latlng, 17);
                        onMarkerClick(location.id);
                      },
                      dragend: () => {
                        const marker = selectedMarkerRef.current;
                        if (marker !== null) {
                          setNewPosition(marker.getLatLng());
                          onMarkerDragEnd(
                            marker.getLatLng().lat,
                            marker.getLatLng().lng
                          );
                        }
                      },
                    }}
                    icon={
                      isSelectedMarker
                        ? divIcon({
                            className: '',
                            html: renderToStaticMarkup(<SelectedMarker />),
                          })
                        : divIcon({
                            className: '',
                            html: renderToStaticMarkup(
                              <BasicMarker
                                color={theme.palette.primary.main}
                                events={noOfRelevantEvents}
                              />
                            ),
                          })
                    }
                    position={
                      isSelectedMarker && newPosition && inMoveState
                        ? newPosition
                        : [location.lat, location.lng]
                    }
                  />
                );
              })}
              {pendingLocation && (
                <Marker
                  icon={divIcon({
                    className: '',
                    html: renderToStaticMarkup(<SelectedMarker />),
                  })}
                  position={[pendingLocation.lat, pendingLocation.lng]}
                />
              )}
            </>
          );
        }}
      </MapWrapper>
    </MapContainer>
  );
};

export default Map;
