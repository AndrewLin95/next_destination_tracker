import { Request, Response } from 'express';
const authService = require('../services/authService');

export const signUp = async (req: Request, res: Response) => {
  try {
    const response = await authService.signUpService(req);
    res.status(200).send(JSON.stringify(response))
  } catch (err) {
    res.status(500).send(err);
  }
}

