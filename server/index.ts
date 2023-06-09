import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
const bcrypt = require("bcryptjs");

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

// Routes
// import authRoutes from './src/routes/authRoutes';
// app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});