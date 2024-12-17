import mongoose from "mongoose";
import config from "./config.js";
const { mongoUrl } = config;

console.log("mongo url", mongoUrl);
const mongooseConnect = async () => await mongoose.connect(`${mongoUrl}`);

export default mongooseConnect;
