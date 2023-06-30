import { Request, Response } from "express";
import projectService from "../services/projectService";
import { CreateProjectQuery, LocationMongoResponse, NotePayloadData, SearchQuery } from "../utils/types";
import { ERROR_CODES } from "../utils/constants";

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

    const response: LocationMongoResponse | ERROR_CODES = await projectService.searchLocation(payload);
    if (response === ERROR_CODES.Duplicate) {
      res.status(409).send(JSON.stringify(ERROR_CODES.Duplicate))
    } else {
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
    const payload: NotePayloadData = req.body;

    const response = await projectService.updateNote(payload);
    res.status(200).send(JSON.stringify(response))
  } catch (err){
    res.status(500).send(err);
  }
}