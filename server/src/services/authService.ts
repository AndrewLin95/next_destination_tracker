import { ErrorRequestHandler, Request } from "express";
const bcrypt = require("bcryptjs");
const AuthUserSchema = require("../models/AuthUserSchema");

const signUp = async (req: Request) => {
  try {
    const existingEmail = await AuthUserSchema.findOne({ userEmail: req.body.signupEmail});

    if (existingEmail) {
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

const authService = {
  signUp
};

export default authService;