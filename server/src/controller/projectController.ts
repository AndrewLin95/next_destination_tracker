import { Request, Response } from "express";
import projectService from "../services/projectService";

export const searchLocation = async (req: Request, res: Response) => {
  try {
    const response = await projectService.searchLocation(req);
    res.status(200).send(JSON.stringify(response))
  } catch (err) {
    res.status(500).send(err);
  }
}