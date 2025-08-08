import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { connectDB } from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import { Server } from "socket.io";

dotenv.config();
const app = express();

const server = http.createServer(app);

//initialize socket.io

export const io = new Server(server, {
  cors: { origin: "*" },
});

//store online user
export const userSocketMap = {}; //{userId:socketId}

//socket.io connection handler

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("if user id is available then user socket map is", userSocketMap)
  }

  //emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.send("server is live");
});

// root route (helps Vercel preview not show "Cannot GET /")
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Chat API is running",
    routes: {
      status: "/api/status",
      auth: "/api/auth/*",
      messages: "/api/messages/*",
    },
  });
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

//connect to Mongo

await connectDB();

const PORT = process.env.PORT || 3001;

if(process.env.NODE_ENV !=="production"){
server.listen(PORT, (req, res) => {
  console.log("server is listening at PORT:", PORT);
});
}

//export server for vercel
export default server;