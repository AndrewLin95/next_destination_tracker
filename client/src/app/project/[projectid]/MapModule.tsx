import { FC } from "react";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import {
  MapData,
  ProjectData,
  ScheduleColors,
} from "@/util/models/ProjectModels";
import Image from "next/image";
import { formatInTimeZone } from "date-fns-tz";
import { DAYS_OF_WEEK, HEX_TRANSPARENCY } from "@/util/constants";

interface Props {
  projectData: ProjectData;
  mapData: MapData[];
  mapCenter: { lat: number; lng: number };
  handleActiveNote: (locationID: string, index: number) => void;
  activeInfoWindow: number | null;
  handleInactivateNote: () => void;
  scheduleColors: ScheduleColors;
}

const MapModule: FC<Props> = ({
  projectData,
  mapData,
  mapCenter,
  handleActiveNote,
  activeInfoWindow,
  handleInactivateNote,
  scheduleColors,
}) => {
  //https://www.ultimateakash.com/blog-details/Ii0jNGAKYAo=/How-To-Integrate-Google-Maps-in-React-2022
  const mapClicked = (event: any) => {
    console.log(event.latLng.lat(), event.latLng.lng());
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
          center={mapCenter}
          zoom={12}
          onClick={mapClicked}
        >
          {mapData.map((marker, index) => {
            let date: string | undefined;
            let dayOfWeek: DAYS_OF_WEEK | undefined = undefined;
            if (marker.scheduleDate !== undefined) {
              date = formatInTimeZone(marker.scheduleDate, "GMT", "iii");
              dayOfWeek = formatInTimeZone(
                marker.scheduleDate,
                "GMT",
                "iiii"
              ) as DAYS_OF_WEEK;
            }

            const labelInformation = {
              text: date === undefined ? " " : date,
              fontSize: "12px",
            };

            return (
              <Marker
                key={index}
                position={marker.position}
                label={labelInformation}
                // draggable={marker.draggable}
                onDragEnd={(event) => markerDragEnd(event, index)}
                onClick={(e) => handleActiveNote(marker.locationID, index)}
                onLoad={(marker) => {
                  const customIcon = (opts: any) =>
                    Object.assign(
                      {
                        path: "M 16 0 C 14 -9 12 -15 0 -17 C -12 -15 -14 -9 -16 0 M -16 0 C -15 15 -5 15 0 28 C 5 15 15 15 16 0",
                        fillColor: `#FF0000${HEX_TRANSPARENCY.SeventyPercent}`,
                        fillOpacity: 0.8,
                        strokeColor: "#000",
                        strokeWeight: 0.4,
                        scale: 0.85,
                      },
                      opts
                    );

                  if (dayOfWeek !== undefined) {
                    marker.setIcon(
                      customIcon({
                        fillColor: `${scheduleColors[dayOfWeek]}${HEX_TRANSPARENCY.NinetyPercent}`,
                      })
                    );
                  }
                }}
              >
                {activeInfoWindow === index && (
                  <InfoWindow
                    position={marker.position}
                    onCloseClick={() => handleInactivateNote()}
                  >
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
                        {marker.picture === undefined ||
                        marker.picture === "" ? null : (
                          <Image
                            src={marker.picture}
                            alt={`${marker.noteName} picture`}
                            className="w-full h-20 object-cover"
                            width={144}
                            height={144}
                          />
                        )}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            );
          })}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapModule;
