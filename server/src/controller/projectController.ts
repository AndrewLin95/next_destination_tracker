import { Request, Response } from "express";
import projectService from "../services/projectService";
import { CreateProjectQuery, SearchQuery } from "../utils/types";

export const createNewProject = async (req: Request, res: Response) => {
  try {
    // to add image
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
    const tokenString: string = req.headers['authorization']?.split(' ')[1] as string;

    const response = await projectService.searchLocation(payload, tokenString);
    res.status(200).send(JSON.stringify(response))
  } catch (err) {
    res.status(500).send(err);
  }
}