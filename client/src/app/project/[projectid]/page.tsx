/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Header from "./Header";
import { NextPage } from "next";
import SearchModule from "./SearchModule";
import MapModule from "./MapModule";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/app/context/AuthContext";
import {
  ProjectData,
  LocationData,
  MapData,
  NoteData,
  ScheduleData,
  StatusPayload,
  NoteDataResponse,
  DroppedParsedData,
  ScheduleDataResponse,
  ScheduleConfigData,
  DeleteNoteResponse,
  DeleteScheduleResponse,
} from "@/util/models/ProjectModels";
import { AuthState } from "@/util/models/AuthModels";
import authConfigData from "@/util/authConfig";
import axios, { isAxiosError } from "axios";
import SearchResults from "./searchComponents/SearchResults";
import {
  ERROR_CAUSE,
  ERROR_DATA,
  STATUS_CODES,
  VIEW_TYPES,
} from "@/util/constants";
import EditNoteDialog from "./components/EditNoteDialog";
import { useRouter } from "next/navigation";
import ErrorDialog from "@/components/ErrorDialog";
import ScheduleModule from "./ScheduleModule";
import ProjectProfileDialog from "./components/ProjectProfileDialog";
import ScheduleSettingsDialog from "./components/ScheduleSettingsDialog";
import SortFilterModal from "./searchComponents/SortFilterModal";
import DarkModeButton from "@/components/DarkMode/DarkMode";

interface InitResponseData {
  projectData: ProjectData;
  locationData: LocationData[];
  scheduleData: ScheduleData;
  scheduleConfig: ScheduleConfigData;
}

interface Props {
  params: any;
}

const ProjectPage: NextPage<Props> = ({ params }) => {
  const router = useRouter();
  const { authState, setAuthState } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState<ProjectData>(
    {} as ProjectData
  );
  const [allLocationData, setAllLocationData] = useState<LocationData[]>(
    [] as LocationData[]
  );
  const [searchText, setSearchText] = useState<string>("");
  const [viewToggle, setViewToggle] = useState<VIEW_TYPES>(VIEW_TYPES.Map);

  // Page Data
  const [mapData, setMapData] = useState<MapData[]>([]);
  const [noteData, setNoteData] = useState<NoteData[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleData>(
    {} as ScheduleData
  );
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfigData>(
    {} as ScheduleConfigData
  );

  // Map Data
  const [activeInfoWindow, setActiveInfoWindow] = useState<number | null>(null);
  const [activeLocationID, setActiveLocationID] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    {} as { lat: number; lng: number }
  );

  // Dialog Data
  const [noteDialogToggle, setNoteDialogToggle] = useState<Boolean>(false);
  const [noteDialogData, setNoteDialogData] = useState<NoteData>(
    {} as NoteData
  );

  const [errorDialogToggle, setErrorDialogToggle] = useState<Boolean>(false);
  const [errorDialogData, setErrorDialogData] = useState<StatusPayload>(
    {} as StatusPayload
  );

  const [projectSettingsToggle, setProjectSettingsToggle] =
    useState<Boolean>(false);

  const [scheduleSettingsToggle, setScheduleSettingsToggle] =
    useState<Boolean>(false);

  //Sort and Filter Data
  const [locationIDArray, setLocationIDArray] = useState<string[]>([]);
  const [sortValue, setSortValue] = useState("name");
  const [sortedNoteData, setSortedNoteData] = useState<NoteData[]>([]);
  const [ascending, setAscending] = useState(true);

  //Sort data
  useEffect(() => {
    const sortByValue = (value: string) => {
      let tempNoteData: NoteData[] = [...noteData];

      if (value === "name") {
        if (ascending) {
          tempNoteData.sort((a, b) => a.noteName.localeCompare(b.noteName));
        } else {
          tempNoteData.sort((a, b) => b.noteName.localeCompare(a.noteName));
        }
      } else if (value === "date") {
        if (ascending) {
          tempNoteData.sort((a, b) =>
            a.scheduleDate
              ? b.scheduleDate
                ? a.scheduleDate - b.scheduleDate
                : -1
              : 1
          );
        } else {
          tempNoteData.sort((a, b) =>
            a.scheduleDate
              ? b.scheduleDate
                ? b.scheduleDate - a.scheduleDate
                : 1
              : -1
          );
        }
      } else if (value === "priority") {
        const order = { Low: 1, Medium: 2, High: 3 };
        if (ascending) {
          tempNoteData.sort((a, b) => order[b.priority] - order[a.priority]);
        } else {
          tempNoteData.sort((a, b) => order[a.priority] - order[b.priority]);
        }
      }

      setSortedNoteData(tempNoteData);
    };

    sortByValue(sortValue);
  }, [sortValue, noteData, ascending]);

  useEffect(() => {
    if (
      params.projectid === undefined ||
      (authState as AuthState).token === undefined
    ) {
      router.push("/homepage");
    }

    const fetchInitPageData = async () => {
      const url = `/api/project/geteachproject/${params.projectid}`;
      const authConfig = {
        headers: {
          Authorization: `Bearer ${(authState as AuthState).token}`,
        },
      };

      const response = await axios.get<InitResponseData>(url, authConfig);
      const responseData: InitResponseData = response.data;
      setProjectData(responseData.projectData);
      setAllLocationData(responseData.locationData);
      setScheduleData(responseData.scheduleData);
      setScheduleConfig(responseData.scheduleConfig);

      // handle initial data mapping
      const tempMapData: MapData[] = [];
      const tempNoteData: NoteData[] = [];

      let i = 0;
      responseData.locationData.forEach((eachLocationData) => {
        if (i === 10) {
          return;
        }
        const eachMapData = {
          ...eachLocationData.mapData,
          locationID: eachLocationData.locationID,
        };
        tempMapData.push(eachMapData);

        const eachNoteData = {
          ...eachLocationData.noteData,
          locationID: eachLocationData.locationID,
        };
        tempNoteData.push(eachNoteData);
      });
      setMapData(tempMapData);
      setNoteData(tempNoteData);
      setSortedNoteData(tempNoteData);

      const initMapCenter = {
        lat: parseFloat(responseData.projectData.project.projectCoords.lat),
        lng: parseFloat(responseData.projectData.project.projectCoords.lng),
      };
      setMapCenter(initMapCenter);

      setLoading(false);
    };
    fetchInitPageData();
  }, []);

  const handleSearch = () => {
    //https://developers.google.com/maps/documentation/geocoding/requests-geocoding#json
    const fetchSearchData = async () => {
      const url = `/api/project/searchlocation`;
      const authConfig = {
        headers: {
          Authorization: `Bearer ${(authState as AuthState).token}`,
        },
      };
      const body = {
        userID: (authState as AuthState).userID,
        projectID: params.projectid as string,
        query: searchText.split(" ").join("+"),
      };
      try {
        const response = await axios.post(url, body, authConfig);
        const responseData: LocationData = response.data;

        const tempAllLocationData = allLocationData;
        tempAllLocationData.push(responseData);
        setAllLocationData(tempAllLocationData);

        const tempMapData = [...mapData];
        tempMapData.push(responseData.mapData);
        setMapData(tempMapData);

        const tempNoteData = [...noteData];
        tempNoteData.push(responseData.noteData);
        setNoteData(tempNoteData);
      } catch (err) {
        if (isAxiosError(err)) {
          const responseBody: StatusPayload = err.response?.data.status;
          if (responseBody.statusCode === STATUS_CODES.Duplicate) {
            setErrorDialogData(responseBody);
            setErrorDialogToggle(true);
          }
        }
      }
    };
    fetchSearchData();
    setSearchText("");
  };

  const handleEditNoteDialog = (note: NoteData) => {
    setNoteDialogToggle(true);
    setNoteDialogData(note);
  };

  const handleUpdateNotes = (newNoteData: NoteData) => {
    const updateRequest = async () => {
      const tempMapData = mapData.filter(
        (data) => data.locationID === newNoteData.locationID
      );

      const url = `/api/project/updatenote`;
      const body = { noteData: newNoteData, mapData: tempMapData[0] };
      const authConfig = {
        headers: {
          Authorization: `Bearer ${(authState as AuthState).token}`,
        },
      };

      try {
        const updateNoteResponse = await axios.put(url, body, authConfig);
        const noteResponseData: NoteDataResponse | { status: StatusPayload } =
          updateNoteResponse.data;

        if (noteResponseData.status.statusCode === STATUS_CODES.SUCCESS) {
          const incomingLocationID = (noteResponseData as NoteDataResponse).data
            .locationID;

          const indexOfUpdate = noteData.findIndex(
            (note) => note.locationID === incomingLocationID
          );

          const tempNoteData = [...noteData];
          tempNoteData[indexOfUpdate] = (
            noteResponseData as NoteDataResponse
          ).data.noteData;
          setNoteData(tempNoteData);

          const indexOfMapUpdate = mapData.findIndex(
            (data) => data.locationID === incomingLocationID
          );
          const tempMapData = [...mapData];
          tempMapData[indexOfMapUpdate] = (
            noteResponseData as NoteDataResponse
          ).data.mapData;
          setMapData(tempMapData);

          const indexOfAllNoteDataUpdate = allLocationData.findIndex(
            (note) => note.locationID === incomingLocationID
          );
          const tempAllLocationData = [...allLocationData];
          tempAllLocationData[indexOfAllNoteDataUpdate] = (
            noteResponseData as NoteDataResponse
          ).data;
          setAllLocationData(tempAllLocationData);
        }
      } catch (err) {
        if (isAxiosError(err)) {
          const responseBody: { status: StatusPayload } =
            err.response?.data.status;
          if (responseBody.status.statusCode === STATUS_CODES.ServerError) {
            setErrorDialogData(responseBody.status);
            setErrorDialogToggle(true);
          }
        }
      }
    };
    updateRequest();
    setNoteDialogToggle(false);
  };

  const handleDeleteNote = (locationID: string) => {
    const deleteRequest = async () => {
      const url = `/api/project/deletelocation/${projectData.projectID}/${locationID}`;
      const body = {};
      const authConfig = {
        headers: {
          Authorization: `Bearer ${(authState as AuthState).token}`,
        },
      };

      try {
        const deleteNoteResponse = await axios.put(url, body, authConfig);
        const deleteNoteData: DeleteNoteResponse = deleteNoteResponse.data;

        if (deleteNoteData.status.statusCode === STATUS_CODES.SUCCESS) {
          const tempMapData: MapData[] = [...mapData];
          const tempNoteData: NoteData[] = [...noteData];

          const newMapData = tempMapData.filter(
            (mapData) => mapData.locationID !== locationID
          );
          setMapData(newMapData);

          const newNoteData = tempNoteData.filter(
            (noteData) => noteData.locationID !== locationID
          );
          setNoteData(newNoteData);

          if (deleteNoteData.scheduleData !== undefined) {
            setScheduleData(deleteNoteData.scheduleData);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    deleteRequest();
  };

  const handleActiveNote = (locationID: string, index?: number) => {
    if (index === undefined) {
      const index = mapData.findIndex((data) => data.locationID === locationID);
      setActiveInfoWindow(index);
    } else {
      setActiveInfoWindow(index);
    }
    setActiveLocationID(locationID);
  };

  const handleInactivateNote = () => {
    setActiveInfoWindow(null);
    setActiveLocationID(null);
  };

  const handleViewChange = () => {
    if (viewToggle === VIEW_TYPES.Map) {
      setViewToggle(VIEW_TYPES.Schedule);
    } else {
      setViewToggle(VIEW_TYPES.Map);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, note: NoteData) => {
    const dropData = {
      noteName: note.noteName,
      noteMessage: note.customNote,
      notePriority: note.priority,
      locationID: note.locationID,
    };

    e.dataTransfer.setData("application/json", JSON.stringify(dropData));
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    time: string,
    date: string,
    dateUnix: number,
    enabledOrDisabled: boolean
  ) => {
    e.preventDefault();
    if (!enabledOrDisabled) {
      const status: StatusPayload = {
        statusCode: STATUS_CODES.BadRequest,
        errorCause: ERROR_CAUSE.Schedule,
        errorData: ERROR_DATA.ScheduleDisabled,
      };

      setErrorDialogData(status);
      setErrorDialogToggle(true);
      return;
    }

    const data = e.dataTransfer.getData("application/json");
    const parsedData: DroppedParsedData = JSON.parse(data);

    const handlePostScheduleData = async () => {
      const url = `/api/project/setscheduledata/`;
      const body = {
        ...parsedData,
        time: time,
        date: date,
        dateUnix: dateUnix,
        projectID: projectData.projectID,
        duration: 120,
      };
      const authConfig = authConfigData((authState as AuthState).token);

      try {
        const response = await axios.post<ScheduleDataResponse>(
          url,
          body,
          authConfig
        );
        const scheduleResponseData = response.data;
        if (scheduleResponseData.status.statusCode === STATUS_CODES.SUCCESS) {
          const incomingLocationID =
            scheduleResponseData.locationData.locationID;
          const indexOfUpdate = noteData.findIndex(
            (note) => note.locationID === incomingLocationID
          );

          const tempNoteData = [...noteData];
          tempNoteData[indexOfUpdate] =
            scheduleResponseData.locationData.noteData;
          setNoteData(tempNoteData);

          const tempMapData = [...mapData];
          tempMapData[indexOfUpdate] =
            scheduleResponseData.locationData.mapData;
          setMapData(tempMapData);

          const indexOfAllNoteDataUpdate = allLocationData.findIndex(
            (note) => note.locationID === incomingLocationID
          );
          const tempAllLocationData = [...allLocationData];
          tempAllLocationData[indexOfAllNoteDataUpdate] =
            scheduleResponseData.locationData;
          setAllLocationData(tempAllLocationData);

          setScheduleData(scheduleResponseData.scheduleData);
        } else {
          setErrorDialogData(scheduleResponseData.status);
          setErrorDialogToggle(true);
        }
      } catch (err) {
        if (isAxiosError(err)) {
          const responseBody: { status: StatusPayload } =
            err.response?.data.status;
          if (responseBody.status.statusCode === STATUS_CODES.ServerError) {
            setErrorDialogData(responseBody.status);
            setErrorDialogToggle(true);
          }
        }
      }
    };
    handlePostScheduleData();
  };

  const handleDeleteSchedule = (locationID: string) => {
    const handleDeleteScheduleData = async () => {
      const url = `/api/project/deleteschedule/${projectData.projectID}/${locationID}`;
      const body = {};
      const authConfig = authConfigData((authState as AuthState).token);

      try {
        const response = await axios.put(url, body, authConfig);
        const responseData: DeleteScheduleResponse = response.data;

        const tempMapData: MapData[] = [...mapData];
        const mapIndex = tempMapData.findIndex(
          (value) => value.locationID === locationID
        );
        tempMapData[mapIndex] = responseData.locationData.mapData;

        const tempNoteData: NoteData[] = [...noteData];
        const noteIndex = tempNoteData.findIndex(
          (value) => value.locationID === locationID
        );
        tempNoteData[noteIndex] = responseData.locationData.noteData;

        setScheduleData(responseData.scheduleData);
        setNoteData(tempNoteData);
        setMapData(tempMapData);
      } catch (err) {}
    };
    handleDeleteScheduleData();
  };

  useEffect(() => {
    console.log("mapdata", mapData);
    console.log("notedata", noteData);
    console.log("proj data", projectData);
    console.log("schedule data", scheduleData);
  }, [mapData, noteData]);

  return (
    <div className="w-screen h-screen max-h-screen overflow-hidden flex flex-col justify-center items-center bg-primary text-black dark:bg-dark_primary dark:text-white">
      {loading ? (
        // TODO: loading component
        <></>
      ) : (
        <>
          <Header
            setProjectSettingsToggle={setProjectSettingsToggle}
            projectImage={projectData.project.projectImage}
            projectName={projectData.project.projectName}
          />
          <div className="flex flex-row w-full h-[calc(100vh-4rem)]">
            <div className="flex flex-col w-96 max-w-[24rem] h-full border border-primary2 dark:border-dark_primary2">
              <SearchModule
                searchText={searchText}
                setSearchText={setSearchText}
                handleSearch={handleSearch}
              />
              <SortFilterModal
                noteData={noteData}
                setLocationIDArray={setLocationIDArray}
                setSortValue={setSortValue}
                sortValue={sortValue}
                ascending={ascending}
                setAscending={setAscending}
              />
              <SearchResults
                sortedNoteData={sortedNoteData}
                handleEditNoteDialog={handleEditNoteDialog}
                handleDeleteNote={handleDeleteNote}
                activeLocationID={activeLocationID}
                handleActiveNote={handleActiveNote}
                viewToggle={viewToggle}
                handleDrag={handleDrag}
                scheduleColors={projectData.scheduleColors}
                locationIDArray={locationIDArray}
              />
            </div>
            {viewToggle === VIEW_TYPES.Map ? (
              <MapModule
                projectData={projectData}
                mapData={mapData}
                mapCenter={mapCenter}
                handleActiveNote={handleActiveNote}
                activeInfoWindow={activeInfoWindow}
                handleInactivateNote={handleInactivateNote}
                scheduleColors={projectData.scheduleColors}
                locationIDArray={locationIDArray}
              />
            ) : (
              <ScheduleModule
                projectData={projectData}
                scheduleData={scheduleData}
                scheduleConfig={scheduleConfig}
                handleDrop={handleDrop}
                handleDeleteSchedule={handleDeleteSchedule}
                setScheduleSettingsToggle={setScheduleSettingsToggle}
              />
            )}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <button
                type="button"
                onClick={() => handleViewChange()}
                className="bg-accent1 dark:bg-dark_accent1 border-black h-10 px-4 py-0 rounded-3xl"
              >
                {viewToggle === VIEW_TYPES.Map
                  ? `Toggle Schedule View`
                  : `Toggle Map View`}
              </button>
            </div>
          </div>
          <DarkModeButton />
        </>
      )}
      {noteDialogToggle ? (
        <EditNoteDialog
          noteData={noteDialogData}
          setNoteDialogToggle={setNoteDialogToggle}
          handleUpdateNotes={handleUpdateNotes}
        />
      ) : null}
      {errorDialogToggle ? (
        <ErrorDialog
          setErrorDialogToggle={setErrorDialogToggle}
          errorDialogData={errorDialogData}
        />
      ) : null}
      {projectSettingsToggle ? (
        <ProjectProfileDialog
          projectData={projectData}
          setProjectSettingsToggle={setProjectSettingsToggle}
          authState={authState}
          setProjectData={setProjectData}
          setErrorDialogToggle={setErrorDialogToggle}
          setErrorDialogData={setErrorDialogData}
        />
      ) : null}
      {scheduleSettingsToggle ? (
        <ScheduleSettingsDialog
          setScheduleSettingsToggle={setScheduleSettingsToggle}
          projectData={projectData}
          authState={authState}
          setProjectData={setProjectData}
          setErrorDialogToggle={setErrorDialogToggle}
          setErrorDialogData={setErrorDialogData}
        />
      ) : null}
    </div>
  );
};

export default ProjectPage;
