import { FC, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import { MapData, ProjectData } from "@/util/models";
import Image from "next/image";

interface Props {
  projectData: ProjectData;
  mapData: MapData[];
}

const MapModule: FC<Props> = ({ projectData, mapData }) => {
  //https://www.ultimateakash.com/blog-details/Ii0jNGAKYAo=/How-To-Integrate-Google-Maps-in-React-2022
  const center = {
    lat: parseFloat(projectData!.project.projectCoords.lat),
    lng: parseFloat(projectData!.project.projectCoords.lng),
  };

  const [activeInfoWindow, setActiveInfoWindow] = useState<number | null>(null);
  // const [markers, setMarkers] = useState(mapData);

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
          {mapData.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              // label={marker.label}
              // draggable={marker.draggable}
              onDragEnd={(event) => markerDragEnd(event, index)}
              onClick={(event) => markerClicked(marker, index)}
            >
              {activeInfoWindow === index && (
                <InfoWindow position={marker.position}>
                  <div className="text-black font-bold flex flex-col">
                    <div className="capitalize pb-2 text-lg">
                      {marker.noteName !== undefined
                        ? marker.noteName
                        : "no data"}
                    </div>
                    <div className="pb-2 font-normal">
                      {marker.formattedAddress}
                    </div>
                    <div>
                      {marker.picture !== undefined ? (
                        <Image
                          src={marker.picture}
                          alt={`${marker.noteName} picture`}
                          className="w-full h-20 object-cover"
                          width={144}
                          height={144}
                        />
                      ) : null}
                    </div>
                  </div>
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
