import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
const bcrypt = require("bcryptjs");
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

dotenv.config();
const app: Express = express();
const port: string = process.env.PORT || "8080";

// MongoConnection
const mongoDBUriKey: string = process.env.MONGO_ATLAS_URI || "";
mongoose.connect(mongoDBUriKey);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));
db.once("open", () => console.log("Connected to DB!"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const AuthUserSchema = require("./src/models/authUserSchema")

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (username: any, password: any, done: any) => {
      try {
        const user = await AuthUserSchema.findOne({ userEmail: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };
        
        bcrypt.compare(password, user.userPassword, (err: any, res: any) => {
          if (res) {
            return done(null, user, { message: 'Logged in Successfully' });
          } else {
            return done(null, false, { message: "Incorrect password"});
          }
        })
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Routes
// import authRoutes from './src/routes/authRoutes';
// app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});