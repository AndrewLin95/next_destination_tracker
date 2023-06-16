import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
const jwt = require('jsonwebtoken');
import { jwtToken, CreateProjectQuery, SearchQuery } from "../utils/types";
import { GoogleGeocodeResponse } from '../utils/googleGeocodingTypes';
import { msInDay } from '../utils/constants';

const createNewProject = async (payload: CreateProjectQuery) => {
  const startDate = Date.parse(payload.projectStartDate);
  const endDate = Date.parse(payload.projectEndDate) + msInDay - 1;

  try {
    const addressQuery = payload.projectDestination.split(' ').join('+');
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${addressQuery}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    const queryResponse: GoogleGeocodeResponse = await axios.get(url);

    if (queryResponse.statusText === "OK") {
      const data = {
        userID: payload.userID,
        projectID: uuidv4(),
        project: {
          projectName: payload.projectName,
          projectDescription: payload.projectDescription,
          projectStartDate: startDate,
          projectEndDate: endDate,
          projectCoords: {
            destination: queryResponse.data.results[0].formatted_address,
            lat: queryResponse.data.results[0].geometry.location.lat,
            lng: queryResponse.data.results[0].geometry.location.lng,
          }
        }
      }

      const tempData = data;
      console.log(data);

    }


  } catch (err) {
    console.log(err);
  }
}


const searchLocation = async (payload: SearchQuery, tokenString: string) => {
  const decodedToken: jwtToken = jwt.verify(tokenString, process.env.JWT_SECRET);
  try {
    // https://developers.google.com/maps/documentation/geocoding/requests-geocoding
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${payload.data.query}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    const queryResponse: GoogleGeocodeResponse = await axios.get(url)
    
    // TODO: error handling
    if (queryResponse.statusText === "OK") {
      const data = {
        formattedAddress: queryResponse.data.results[0].formatted_address,
        lat: queryResponse.data.results[0].geometry.location.lat,
        lng: queryResponse.data.results[0].geometry.location.lng,
        googleLocationID: queryResponse.data.results[0].place_id
      }

    } 


  } catch (err) {
    console.log(err);
  }
}

const projectService = {
  createNewProject,
  searchLocation,
}

export default projectService;