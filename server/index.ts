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

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const AuthUserSchema = require("./src/models/AuthUserSchema")

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email: any, password: any, done: any) => {
      try {
        const user = await AuthUserSchema.findOne({ userEmail: email });
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

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token: any, done: any) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Routes
import authRoutes from './src/routes/authRoutes';
import projectRoutes from './src/routes/projectRoutes';
import testSecureRoute from './src/routes/testSecureRoute';

app.use('/api/auth', authRoutes);
app.use('/api/project', passport.authenticate('jwt', { session: false }), projectRoutes);
app.use('/api/test', passport.authenticate('jwt', { session: false }), testSecureRoute);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});