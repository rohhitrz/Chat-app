import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { connectDB } from "./utils/db.js";

dotenv.config();
const app = express();

const server = http.createServer(app);

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.send("server is live");
});

//connect to Mongo

await connectDB();

const PORT= process.env.PORT || 3001;

server.listen(PORT, (req,res)=>{
    console.log("server is listening at PORT:", PORT)
})


