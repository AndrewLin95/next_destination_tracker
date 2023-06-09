import { ErrorRequestHandler, Request } from "express";
const AuthUserSchema = require("../models/AuthUserSchema");
const bcrypt = require("bcryptjs");

const signUpService = async (req: Request) => {
  try {
    const saltLength = 10;
    bcrypt.hash(req.body.signupPassword, saltLength, async(err: ErrorRequestHandler, hashedPassword: string) => {
      console.log(err);

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

module.exports = {
  signUpService,
}