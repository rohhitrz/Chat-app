import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();
//function to generate token for a user

export const generateToken=(userId)=>{
    const token=jwt.sign({userId},process.env.SECRET)
    return token
}