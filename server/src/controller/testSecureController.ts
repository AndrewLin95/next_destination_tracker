import { Request, Response } from 'express';

export const secureTest = async (req: any, res: Response) => {
  res.json({
    message: 'You made it to the secure route',
    user: req.user,
    token: req.query.secret_token
  })
}