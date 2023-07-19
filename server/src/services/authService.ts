import { ErrorRequestHandler, Request } from "express";
const bcrypt = require("bcryptjs");
const AuthUserSchema = require("../models/AuthUserSchema");
const jwt = require('jsonwebtoken');
import { AuthUserResponse, jwtToken } from "../utils/models/AuthModels";

const signUp = async (req: Request) => {
  try {
    const existingUser: AuthUserResponse = await AuthUserSchema.findOne({ userEmail: req.body.signupEmail});

    if (existingUser) {
      return 'This email is already in use'
    }

    const saltLength = 10;
    bcrypt.hash(req.body.signupPassword, saltLength, async(err: ErrorRequestHandler, hashedPassword: string) => {
      const user = new AuthUserSchema({
        userEmail: req.body.signupEmail,
        userPassword: hashedPassword,
        joinDate: new Date(),
        firstName: req.body.signupFirstName,
        lastName: req.body.signupLastName,
      })
      const result = await user.save();
      return result;
    })

  } catch (err) {
    console.log(err);
  }
};

const verifyToken = async (req: Request) => {
  const token: string = req.body.token;
  if (token) {
    const decodedToken: jwtToken = jwt.verify(token, process.env.JWT_SECRET);
    const now = Date.now();

    if (decodedToken.exp > now) {
      return 'Invalid token'
    } else {
      const body = { 
        _id: decodedToken.user._id, 
        email: decodedToken.user.email
      };
      const refreshToken: string = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '7d' });

      return refreshToken;
    }
  } else {
    return "Invalid token"
  }

}

const authService = {
  signUp,
  verifyToken,
};

export default authService;