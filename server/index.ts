import express, { Express } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { AuthUserResponse } from './src/utils/models/AuthModels';
const bcrypt = require("bcryptjs");
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

dotenv.config();
const app: Express = express();
const port: string = process.env.PORT || "8080";

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow the HTTP methods you need
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow the headers you need

  if (req.method === 'OPTIONS') {
    // Handle preflight requests (OPTIONS method)
    res.sendStatus(200);
  } else {
    // Continue processing other requests
    next();
  }

  // res.header('Access-Control-Allow-Origin', '*');
  // // res.header('Access-Control-Allow-Headers', 'Content-Type')

  // // // Allow specific HTTP methods
  // // res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  // // // Handle preflight requests (OPTIONS requests)
  // // if (req.method === 'OPTIONS') {
  // //   return res.status(200).end();
  // // }

  // next();
})

// MongoConnection
const mongoDBUriKey: string = process.env.MONGO_ATLAS_URI || "";
mongoose.connect(mongoDBUriKey);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));
db.once("open", () => console.log("Connected to DB!"));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));



const AuthUserSchema = require("./src/models/authUserSchema")

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email: any, password: any, done: any) => {
      try {
        const user: AuthUserResponse = await AuthUserSchema.findOne({ userEmail: email });
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