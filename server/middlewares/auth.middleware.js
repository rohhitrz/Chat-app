import User from "../models/user.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const protectRoute=async(req,res,next)=>{
    try{
        const token=req.headers.token;
        const decoded=jwt.verify(token,process.env.SECRET);
        const user=await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.json({
                success:false,
                message:"user not found"
            })
        }
        req.user=user;
        next();
    }catch(err){
        console.log(err.message);
        return res.json({
            success:false,
            message:err.message
        })

    }

}