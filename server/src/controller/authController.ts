import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const authService = require('../services/authService');

export const signUp = async (req: Request, res: Response) => {
  try {
    const response = await authService.signUpService(req);
    res.status(200).send(JSON.stringify(response))
  } catch (err) {
    res.status(500).send(err);
  }
}

export const logIn = async (req: any, res: Response, next: any ) => {

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

            const body = { _id: user._id, email: user.email };
            const token = jwt.sign({ user: body }, 'TOP_SECRET');

            return res.json({ token });
          }
        );
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);

}

export const test = async (req: Request, res: Response) => {
  try {
    res.status(200).send(JSON.stringify('asdfasdf'));
  } catch (err) {
    res.status(500).send(err)
  }
}