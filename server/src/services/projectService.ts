import axois from 'axios';
const jwt = require('jsonwebtoken');
import { jwtToken, SearchQuery } from "../utils/types";
import { GoogleGeocodeResponse } from '../utils/googleGeocodingTypes';

const searchLocation = async (payload: SearchQuery, tokenString: string) => {
  const decodedToken: jwtToken = jwt.verify(tokenString, process.env.JWT_SECRET);
  try {
    // https://developers.google.com/maps/documentation/geocoding/requests-geocoding
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${payload.data.query}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    const queryResponse: GoogleGeocodeResponse = await axois.get(url)
    
    // TODO: error handling
    if (queryResponse.status === "Ok") {
      const data = {
        formattedAddress: queryResponse.results[0].formatted_address,
        lat: queryResponse.results[0].geometry.location.lat,
        lng: queryResponse.results[0].geometry.location.lng,
        googleLocationID: queryResponse.results[0].place_id
      }

      



    } 


  } catch (err) {
    console.log(err);
  }




}

const projectService = {
  searchLocation,
}

export default projectService;