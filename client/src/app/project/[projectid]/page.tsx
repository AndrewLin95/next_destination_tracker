"use client";
import Header from "./Header";
import { NextPage } from "next";
import SearchModule from "./SearchModule";
import MapModule from "./MapModule";
import { useContext, useEffect, useState } from "react";
import UserContext from "@/app/context/UserProfileContext";
import {
  UserProfileState,
  ProjectData,
  LocationData,
  MapData,
  NoteData,
  ScheduleData,
  StatusPayload,
  NoteDataResponse,
  ScheduleDateData,
  ScheduleCalendarData,
} from "@/util/models";
import axios, { isAxiosError } from "axios";
import SearchResults from "./searchComponents/SearchResults";
import SearchPagination from "./searchComponents/SearchPagination";
import {
  NUM_RESULTS_PER_PAGE,
  STATUS_CODES,
  VIEW_TYPES,
} from "@/util/constants";
import { handleScheduleInit, handleValidatePagination } from "./util";
import EditNoteDialog from "./components/EditNoteDialog";
import { useRouter } from "next/navigation";
import ErrorDialog from "@/components/ErrorDialog";
import ScheduleModule from "./ScheduleModule";

interface InitResponseData {
  projectData: ProjectData;
  locationData: LocationData[];
}

interface Props {
  params: any;
}

const ProjectPage: NextPage<Props> = ({ params }) => {
  const router = useRouter();
  const { userProfileState, setUserProfileState } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState<ProjectData>(
    {} as ProjectData
  );
  const [allLocationData, setAllLocationData] = useState<LocationData[]>(
    [] as LocationData[]
  );
  const [searchText, setSearchText] = useState<string>("");
  const [viewToggle, setViewToggle] = useState<VIEW_TYPES>(VIEW_TYPES.Map);

  // Pagination Data
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [currPage, setCurrPage] = useState(1);
  const [paginationState, setPaginationState] = useState<(string | number)[]>(
    []
  );

  // Page Data
  const [mapData, setMapData] = useState<MapData[]>([]);
  const [noteData, setNoteData] = useState<NoteData[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);

  // Map Data
  const [activeInfoWindow, setActiveInfoWindow] = useState<number | null>(null);
  const [activeLocationID, setActiveLocationID] = useState<string | null>(null);

  // Schedule Data
  const [projectStartEnd, setProjectStartEnd] =
    useState<ScheduleDateData | null>(null);
  const [scheduleCalendarData, setScheduleCalendarData] =
    useState<ScheduleCalendarData | null>(null);

  // Dialog Data
  const [noteDialogToggle, setNoteDialogToggle] = useState<Boolean>(false);
  const [noteDialogData, setNoteDialogData] = useState<NoteData>(
    {} as NoteData
  );

  const [errorDialogToggle, setErrorDialogToggle] = useState<Boolean>(false);
  const [errorDialogData, setErrorDialogData] = useState<StatusPayload>(
    {} as StatusPayload
  );

  useEffect(() => {
    if (params.projectid === undefined) {
      router.push("/homepage");
    } else if ((userProfileState as UserProfileState).token === undefined) {
      router.push("/");
    }

    const fetchInitPageData = async () => {
      const url = `/api/project/geteachproject/${params.projectid}`;
      const authConfig = {
        headers: {
          Authorization: `Bearer ${
            (userProfileState as UserProfileState).token
          }`,
        },
      };

      const response = await axios.get(url, authConfig);
      const responseData: InitResponseData = response.data;

      setProjectData(responseData.projectData);
      setAllLocationData(responseData.locationData);

      // handle initial data mapping
      const tempMapData: MapData[] = [];
      const tempNoteData: NoteData[] = [];
      const tempScheduleData: ScheduleData[] = [];

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

        if (eachLocationData.scheduleData?.scheduleDate !== undefined) {
          const eachScheduleData = {
            ...eachLocationData.scheduleData,
            locationID: eachLocationData.locationID,
          };
          tempScheduleData.push(eachScheduleData);
        }
        i++;
      });
      setMapData(tempMapData);
      setNoteData(tempNoteData);
      setScheduleData(tempScheduleData);

      // handle initial pagination state
      const totalPages = Math.ceil(responseData.locationData.length / 10);
      setNumberOfPages(totalPages);

      // handle schedule init
      const scheduleInitData = handleScheduleInit(responseData.projectData);
      setProjectStartEnd(scheduleInitData.project);
      setScheduleCalendarData(scheduleInitData.schedule);
      console.log(scheduleInitData);

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
          Authorization: `Bearer ${
            (userProfileState as UserProfileState).token
          }`,
        },
      };
      const body = {
        userID: (userProfileState as UserProfileState).userID,
        projectID: params.projectid as string,
        query: searchText.split(" ").join("+"),
      };
      try {
        const response = await axios.post(url, body, authConfig);
        const responseData: LocationData = response.data;

        const tempAllLocationData = allLocationData;
        tempAllLocationData.push(responseData);
        setAllLocationData(tempAllLocationData);

        if (currPage === numberOfPages && noteData.length <= 9) {
          const tempMapData = [...mapData];
          tempMapData.push({
            ...responseData.mapData,
            locationID: responseData.locationID,
          });
          setMapData(tempMapData);

          const tempNoteData = [...noteData];
          tempNoteData.push({
            ...responseData.noteData,
            locationID: responseData.locationID,
          });
          setNoteData(tempNoteData);
        }

        handleValidatePagination(
          "+",
          tempAllLocationData,
          numberOfPages,
          setNumberOfPages
        );
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

  const handlePageChange = (value: string | number) => {
    if (value === "...") {
      return;
    }
    let indexOfFirstPost: number;
    let indexOfLastPost: number;
    if (value === "+") {
      if (currPage + 1 > numberOfPages) {
        return;
      }
      indexOfLastPost = (currPage + 1) * NUM_RESULTS_PER_PAGE;
      indexOfFirstPost = indexOfLastPost - NUM_RESULTS_PER_PAGE;
      setCurrPage(currPage + 1);
    } else if (value === "-") {
      if (currPage - 1 <= 0) {
        return;
      }
      indexOfLastPost = (currPage - 1) * NUM_RESULTS_PER_PAGE;
      indexOfFirstPost = indexOfLastPost - NUM_RESULTS_PER_PAGE;
      setCurrPage(currPage - 1);
    } else {
      indexOfLastPost = Number(value) * NUM_RESULTS_PER_PAGE;
      indexOfFirstPost = indexOfLastPost - NUM_RESULTS_PER_PAGE;
      setCurrPage(Number(value));
    }

    const tempAllLocationData = [...(allLocationData as LocationData[])];
    const filteredAllLocationData = tempAllLocationData.slice(
      indexOfFirstPost,
      indexOfLastPost
    );

    const tempMapData: MapData[] = [];
    const tempNoteData: NoteData[] = [];
    const tempScheduleData: ScheduleData[] = [];

    filteredAllLocationData.forEach((eachLocationData) => {
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

      if (eachLocationData.scheduleData?.scheduleDate !== undefined) {
        const eachScheduleData = {
          ...eachLocationData.scheduleData,
          locationID: eachLocationData.locationID,
        };
        tempScheduleData.push(eachScheduleData);
      }
    });
    setMapData(tempMapData);
    setNoteData(tempNoteData);
    setScheduleData(tempScheduleData);
    handleInactivateNote();
  };

  useEffect(() => {
    if (numberOfPages <= 5) {
      let i = 0;
      const tempPaginationArray = [];
      while (i < numberOfPages) {
        tempPaginationArray.push(i + 1);
        i++;
      }
      setPaginationState(tempPaginationArray);
    } else {
      if (currPage === 1) {
        setPaginationState([1, 2, "...", numberOfPages]);
      } else if (currPage === 2) {
        setPaginationState([1, 2, 3, "...", numberOfPages]);
      } else if (currPage === numberOfPages) {
        setPaginationState([1, "...", currPage - 1, currPage]);
      } else if (currPage === numberOfPages - 1) {
        setPaginationState([1, "...", currPage - 1, currPage, numberOfPages]);
      } else {
        setPaginationState([
          1,
          "...",
          currPage - 1,
          currPage,
          currPage + 1,
          "...",
          numberOfPages,
        ]);
      }
    }
  }, [numberOfPages, currPage]);

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
          Authorization: `Bearer ${
            (userProfileState as UserProfileState).token
          }`,
        },
      };

      try {
        const updateNoteResponse = await axios.put(url, body, authConfig);
        const noteResponseData: NoteDataResponse | { status: StatusPayload } =
          updateNoteResponse.data;

        if (noteResponseData.status.statusCode === STATUS_CODES.SUCCESS) {
          const incomingLocationID = (noteResponseData as NoteDataResponse)
            .noteData.locationID;

          const indexOfUpdate = noteData.findIndex(
            (note) => note.locationID === incomingLocationID
          );

          const tempNoteData = [...noteData];
          tempNoteData[indexOfUpdate] = (
            noteResponseData as NoteDataResponse
          ).noteData;
          setNoteData(tempNoteData);

          const indexOfMapUpdate = mapData.findIndex(
            (data) => data.locationID === incomingLocationID
          );
          const tempMapData = [...mapData];
          tempMapData[indexOfMapUpdate] = (
            noteResponseData as NoteDataResponse
          ).mapData;
          setMapData(tempMapData);
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
      const url = `/api/project/deletelocation/${locationID}`;
      const body = {};
      const authConfig = {
        headers: {
          Authorization: `Bearer ${
            (userProfileState as UserProfileState).token
          }`,
        },
      };

      try {
        const deleteNoteResponse = await axios.put(url, body, authConfig);
        const deleteNoteData: { status: StatusPayload } =
          deleteNoteResponse.data;

        if (deleteNoteData.status.statusCode === STATUS_CODES.SUCCESS) {
          const tempMapData: MapData[] = [...mapData];
          const tempNoteData: NoteData[] = [...noteData];
          const tempScheduleData: ScheduleData[] = [...scheduleData];

          const newMapData = tempMapData.filter(
            (mapData) => mapData.locationID !== locationID
          );
          setMapData(newMapData);

          const newNoteData = tempNoteData.filter(
            (noteData) => noteData.locationID !== locationID
          );
          setNoteData(newNoteData);

          if (tempScheduleData.length !== 0) {
            const newScheduleData = tempScheduleData.filter(
              (scheduleData) => scheduleData.locationID !== locationID
            );
            setScheduleData(newScheduleData);
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

  useEffect(() => {
    console.log("mapdata", mapData);
    console.log("notedata", noteData);
    console.log("proj data", projectData);
  }, [mapData]);

  return (
    <div className="w-screen h-screen max-h-screen overflow-hidden flex flex-col justify-center items-center">
      <Header />
      {loading ? (
        // TODO: loading component
        <></>
      ) : (
        <div className="flex flex-row w-full h-[calc(100vh-4rem)]">
          <div className="flex flex-col w-96 max-w-[24rem] h-full border border-Background_Darker">
            <SearchModule
              searchText={searchText}
              setSearchText={setSearchText}
              handleSearch={handleSearch}
            />
            <SearchResults
              noteData={noteData}
              handleEditNoteDialog={handleEditNoteDialog}
              handleDeleteNote={handleDeleteNote}
              activeLocationID={activeLocationID}
              handleActiveNote={handleActiveNote}
            />
            <SearchPagination
              paginationState={paginationState}
              handlePageChange={handlePageChange}
            />
          </div>
          {viewToggle === VIEW_TYPES.Map ? (
            <MapModule
              projectData={projectData}
              mapData={mapData}
              handleActiveNote={handleActiveNote}
              activeInfoWindow={activeInfoWindow}
              handleInactivateNote={handleInactivateNote}
            />
          ) : (
            <ScheduleModule
              projectStartEnd={projectStartEnd}
              scheduleCalendarData={scheduleCalendarData}
            />
          )}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button
              type="button"
              onClick={() => handleViewChange()}
              className="bg-Background_Lighter/70 h-10 px-4 py-0 rounded-3xl"
            >
              {viewToggle === VIEW_TYPES.Map
                ? `Toggle Schedule View`
                : `Toggle Map View`}
            </button>
          </div>
        </div>
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
    </div>
  );
};

export default ProjectPage;
