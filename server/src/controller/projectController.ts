import { Request, Response } from "express";
import projectService from "../services/projectService";
import { CreateProjectQuery, SearchQuery } from "../utils/types";

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

    const response = await projectService.searchLocation(payload);
    res.status(200).send(JSON.stringify(response))
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
    res.send(500).send(err);
  }
}