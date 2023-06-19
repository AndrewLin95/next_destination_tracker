import axios from 'axios';
import { s3Client } from '../utils/s3';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
const jwt = require('jsonwebtoken');

const ProjectSetupSchema = require('../models/projectSetupSchema');
import { jwtToken, CreateProjectQuery, SearchQuery } from "../utils/types";
import { GoogleGeocodeResponse } from '../utils/googleGeocodingTypes';
import { msInDay } from '../utils/constants';

const createNewProject = async (payload: CreateProjectQuery) => {
  const startDate = Date.parse(payload.projectStartDate);
  const endDate = Date.parse(payload.projectEndDate) + msInDay - 1;
  const newProjectID = uuidv4();

  try {
    const addressQuery = payload.projectDestination.split(' ').join('+');
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${addressQuery}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    const queryResponse: GoogleGeocodeResponse = await axios.get(url);

    if (queryResponse.statusText === "OK") {
      // Upload Image to S3
      const imageBase64 = "data:image/jpeg;base64,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"
      var imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""),'base64')
      const imageType = imageBase64.split(';')[0].split('/')[1];

      const input = {
        Body: imageBuffer,
        Bucket: process.env.AWS_S3_BUCKETNAME as string,
        Key: newProjectID,
        ContentEncoding: 'base64',
        ContentType: `image/${imageType}`
      }

      const command = new PutObjectCommand(input)
      await s3Client.send(command);

      // Save to MongoDB
      const projectSetupData = new ProjectSetupSchema({
        userID: payload.userID,
        projectID: newProjectID,
        project: {
          projectName: payload.projectName,
          projectDescription: payload.projectDescription,
          projectStartDate: startDate,
          projectEndDate: endDate,
          projectImage: `https://${process.env.AWS_S3_BUCKETNAME}.s3.amazonaws.com/${newProjectID}`,
          projectCoords: {
            destination: queryResponse.data.results[0].formatted_address,
            lat: queryResponse.data.results[0].geometry.location.lat,
            lng: queryResponse.data.results[0].geometry.location.lng,
          }
        }
      })

      const result = await projectSetupData.save();

      return result.projectID;
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

const getProject = async (currUserID :string) => {
  try {
    const userProjects = await ProjectSetupSchema.find({userID: currUserID});

    const test = '1';
    return userProjects;
  } catch (err) {
    console.log(err);
  }
}

const projectService = {
  createNewProject,
  searchLocation,
  getProject,
}

export default projectService;