import { NextFunction, Request, Response } from 'express';
import { IGetUserAuthInfoRequest } from '../utils/definitions'
import authService from '../services/authService';
const jwt = require('jsonwebtoken');
const passport = require('passport');

export const signUp = async (req: Request, res: Response) => {
  try {
    const response = await authService.signUp(req);
    res.status(200).send(JSON.stringify(response))
  } catch (err) {
    res.status(500).send(err);
  }
}

export const logIn = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction ) => {
  passport.authenticate(
    'login',
    async (err: any, user: any, info: any) => {
      try {
        if (err || !user) {
          const error = new Error('An error occurred.');

          return next(error);
        }

        req.login(
          user,
          { session: false },
          async (error: any) => {
            if (error) return next(error);
            const body = { 
              _id: user._id, 
              email: user.userEmail
            };
            const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.json({ token });
          }
        );
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
}

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const response = await authService.verifyToken(req);
    res.status(200).send(JSON.stringify(response))
  } catch (err) {
    res.status(500).send(err);
  }
}

export const test = async (req: Request, res: Response) => {
  try {
    res.status(200).send(JSON.stringify('asdfasdf'));
  } catch (err) {
    res.status(500).send(err)
  }
}