import { Request, Response } from "express";
import projectService from "../services/projectService";
import { 
  CreateProjectQuery, 
  LocationMongoResponse, 
  MapPayloadData, 
  NotePayloadData, 
  SearchQuery, 
  StatusPayload,
  NoteDataResponse,
  SetSchedulePayload,
} from "../utils/types";
import { STATUS_CODES } from "../utils/constants";

export const createNewProject = async (req: Request, res: Response) => {
  try {
    const payload: CreateProjectQuery = req.body;

    const response = await projectService.createNewProject(payload);
    res.status(200).send(JSON.stringify(response))
  } catch (err) {
    res.status(500).send(err);
  }
}

export const searchLocation = async (req: Request, res: Response) => {
  try {
    const payload: SearchQuery = req.body;

    const response: LocationMongoResponse | {status: StatusPayload} = await projectService.searchLocation(payload);
    if (response.status.statusCode === STATUS_CODES.Duplicate) {
      res.status(409).send(JSON.stringify(response))
    } else if (response.status.statusCode === STATUS_CODES.ServerError) {
      res.status(500).send(JSON.stringify(response));
    }  
    else {
      res.status(201).send(JSON.stringify(response))
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

export const getProjects = async (req: Request, res: Response) => {
  try {
    const userID: string = req.params.userID;

    const response = await projectService.getProject(userID);
    res.status(200).send(JSON.stringify(response))
  } catch (err) {
    res.status(500).send(err);
  }
}

export const getEachProject = async (req: Request, res: Response) => {
  try {
    const projectID: string = req.params.projectID;
    
    const response = await projectService.getEachProject(projectID);
    res.status(200).send(JSON.stringify(response))
  } catch (err) {
    res.status(500).send(err);
  }
}

export const updateNote = async (req: Request, res: Response) => {
  try{
    const payload: {noteData: NotePayloadData, mapData: MapPayloadData} = req.body;

    const response: NoteDataResponse | { status: StatusPayload } = await projectService.updateNote(payload);
    res.status(200).send(JSON.stringify(response))
  } catch (err){
    res.status(500).send(err);
  }
}

export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const locationID: string = req.params.locationID;
    const projectID: string = req.params.projectID;

    const response: {status: StatusPayload} = await projectService.deleteLocation(locationID, projectID);
    if (response.status.statusCode === STATUS_CODES.ServerError) {
      res.status(500).send(JSON.stringify(response));
    } else {
      res.status(200).send(JSON.stringify(response));
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

export const setScheduleData = async (req: Request, res: Response) => {
  try {
    const payload: SetSchedulePayload = req.body;

    const response = await projectService.setScheduleData(payload);
    res.status(200).send(JSON.stringify(response))
  } catch (err) {
    res.status(500).send(err);
  }
}

export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    const locationID: string = req.params.locationID;
    const projectID: string = req.params.projectID;

    const respose = await projectService.deleteSchedule(locationID, projectID);

  } catch (err) {
    res.status(500).send(err)
  }


}