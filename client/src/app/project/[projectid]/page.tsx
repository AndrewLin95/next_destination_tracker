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
} from "@/util/models";
import axios from "axios";
import SearchResults from "./searchComponents/SearchResults";
import SearchPagination from "./searchComponents/SearchPagination";
import { NUM_RESULTS_PER_PAGE } from "@/util/constants";

interface InitResponseData {
  projectData: ProjectData;
  locationData: LocationData[];
}

interface Props {
  params: any;
}

const ProjectPage: NextPage<Props> = ({ params }) => {
  const { userProfileState, setUserProfileState } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState<ProjectData>(
    {} as ProjectData
  );
  const [allLocationData, setAllLocationData] = useState<LocationData[]>(
    [] as LocationData[]
  );

  // Pagination Data
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [currPage, setCurrPage] = useState(1);
  const [paginationState, setPaginationState] = useState<(string | number)[]>(
    []
  );

  // TODO: fix
  const [mapData, setMapData] = useState<MapData[]>([]);
  const [noteData, setNoteData] = useState<NoteData[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>();

  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
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

      responseData.locationData.forEach((eachLocationData) => {
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

      // handle initial pagination state
      const totalPages = Math.ceil(allLocationData.length / 10);
      setNumberOfPages(totalPages);

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

      const response = await axios.post(url, body, authConfig);
      const responseData: LocationData = response.data;

      const tempAllLocationData = allLocationData;
      tempAllLocationData.push(responseData);
      setAllLocationData(tempAllLocationData);

      if (currPage === numberOfPages && noteData.length <= 9) {
        const tempMapData = mapData;
        tempMapData.push({
          ...responseData.mapData,
          locationID: responseData.locationID,
        });
        setMapData(tempMapData);

        const tempNoteData = noteData;
        tempNoteData.push({
          ...responseData.noteData,
          locationID: responseData.locationID,
        });
        setNoteData(tempNoteData);
      }
    };
    fetchSearchData();
    handleValidatePagination("+");
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

  const handleValidatePagination = (type: string) => {
    let newNumberOfPages;
    if (type === "+") {
      newNumberOfPages = Math.ceil((allLocationData.length + 1) / 10);
    } else {
      newNumberOfPages = Math.ceil((allLocationData.length - 1) / 10);
    }

    if (newNumberOfPages !== numberOfPages) {
      setNumberOfPages(newNumberOfPages);
    }
  };

  useEffect(() => {
    console.log(mapData);
    console.log(paginationState);
    console.log(numberOfPages);
  }, [mapData]);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center">
      <Header />
      {loading ? (
        // TODO: loading component
        <></>
      ) : (
        <div className="flex flex-row w-full h-full">
          <div className="flex flex-col w-1/5 h-full border border-gray-600">
            <SearchModule
              searchText={searchText}
              setSearchText={setSearchText}
              handleSearch={handleSearch}
            />
            <SearchResults />
            <SearchPagination />
          </div>
          <MapModule projectData={projectData} mapData={mapData} />
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
