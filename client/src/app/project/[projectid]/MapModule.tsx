import { useState, useCallback } from "react";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

const MapModule = () => {
  //https://www.ultimateakash.com/blog-details/Ii0jNGAKYAo=/How-To-Integrate-Google-Maps-in-React-2022
  const initialMarkers = [
    {
      position: {
        lat: 28.625485,
        lng: 79.821091,
      },
      label: { color: "white", text: "P1" },
      draggable: true,
    },
    {
      position: {
        lat: 28.625293,
        lng: 79.817926,
      },
      label: { color: "white", text: "P2" },
      draggable: false,
    },
    {
      position: {
        lat: 28.625182,
        lng: 79.81464,
      },
      label: { color: "white", text: "P3" },
      draggable: true,
    },
  ];
  const [activeInfoWindow, setActiveInfoWindow] = useState<number | null>(null);
  const [markers, setMarkers] = useState(initialMarkers);

  const center = {
    lat: 43.65107,
    lng: -79.347015,
  };

  const mapClicked = (event: any) => {
    console.log(event.latLng.lat(), event.latLng.lng());
  };

  const markerClicked = (marker: any, index: number) => {
    setActiveInfoWindow(index);
    console.log(marker, index);
  };

  const markerDragEnd = (event: any, index: any) => {
    console.log(event.latLng.lat());
    console.log(event.latLng.lng());
  };

  return (
    <div className="h-full w-full">
      <LoadScript googleMapsApiKey="">
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={center}
          zoom={12}
          onClick={mapClicked}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              label={marker.label}
              draggable={marker.draggable}
              onDragEnd={(event) => markerDragEnd(event, index)}
              onClick={(event) => markerClicked(marker, index)}
            >
              {activeInfoWindow === index && (
                <InfoWindow position={marker.position}>
                  <b>
                    {marker.position.lat}, {marker.position.lng}
                  </b>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapModule;
