import { jwtToken, SearchQuery } from "../utils/types";
import axois from 'axios';
const jwt = require('jsonwebtoken');

const searchLocation = async (payload: SearchQuery, tokenString: string) => {

  const decodedToken: jwtToken = jwt.verify(tokenString, process.env.JWT_SECRET);


  try {
    // https://developers.google.com/maps/documentation/geocoding/requests-geocoding
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${payload.data.query}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    const response = await axois.get(url)
    
    


  } catch (err) {
    console.log(err);
  }




}

const projectService = {
  searchLocation,
}

export default projectService;