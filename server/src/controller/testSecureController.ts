import { Response } from 'express';
import { IGetUserAuthInfoRequest } from '../utils/definitions'

export const secureTest = async (req: IGetUserAuthInfoRequest, res: Response) => {
  res.json({
    message: 'You made it to the secure route',
    user: req.user,
    token: req.query.secret_token
  })
}