import mongoose from "mongoose";
import dotenv from 'dotenv/config'

const conection = process.env.CONECTION_STRING;

export const bbddConection = mongoose.connect(conection)
  .then(() => {
    console.log("Connected to the BBDD!");
  })
  .catch(err => {
    console.log("Connection Failured", err);
  });