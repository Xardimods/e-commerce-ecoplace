import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const conection = process.env.CONECTION_STRING;

export const db = mongoose.connect(conection)
  .then(() => {
    console.log("Connected to the BBDD!");
  })
  .catch(err => {
    console.log("Connection Failured", err);
  });