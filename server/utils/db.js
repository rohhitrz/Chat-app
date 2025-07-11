import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//function to connect to db
export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/chat-app`).then(() => {
      console.log("db connected successfully");
    });
  } catch (err) {
    console.log("error in connecting db", err);
  }
};
