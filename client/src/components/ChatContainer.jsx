import React, { useContext, useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const scrollEnd = useRef();
  const [input, setInput] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  //handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };
  //handle  sending an Image

  const handleSendImage = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    
    console.log("Processing image file:", file.name, file.type, file.size);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          console.log("File read successfully, sending to server...");
          await sendMessage({ image: reader.result });
          console.log("Image sent successfully");
          resolve();
        } catch (error) {
          console.error("Error sending image:", error);
          reject(error);
        }
      };
      reader.onerror = () => {
        console.error("Error reading file");
        reject(new Error("Failed to read file"));
      };
      reader.readAsDataURL(file);
    });
  };

  //handle file input change
  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await handleSendImage(file);
        toast.success("Image sent successfully!");
        e.target.value = "";
      } catch (error) {
        console.error("Error sending image:", error);
        toast.error("Failed to send image. Please try again.");
      }
    }
  };

  //handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    console.log("Drop event triggered");
    alert("Drop event triggered!"); // Temporary debug alert
    const files = Array.from(e.dataTransfer.files);
    console.log("Dropped files:", files);
    
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    console.log("Image files:", imageFiles);
    
    if (imageFiles.length === 0) {
      toast.error("Please drop only image files");
      return;
    }
    
    try {
      console.log("Starting to process image:", imageFiles[0].name);
      // Send the first image (you can modify this to send multiple images)
      await handleSendImage(imageFiles[0]);
      toast.success("Image sent successfully!");
      
      if (imageFiles.length > 1) {
        toast.success(`Sent 1 of ${imageFiles.length} images. Multiple image sending coming soon!`);
      }
    } catch (error) {
      console.error("Error sending image:", error);
      toast.error("Failed to send image. Please try again.");
    }
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd?.current && messages){
      scrollEnd.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return selectedUser ? (
    <div 
      className={`h-full overflow-scroll relative backdrop-blur-lg transition-all duration-200 ${
        isDragOver ? 'bg-violet-500/20 border-2 border-dashed border-violet-400 drag-over' : ''
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3 py-2 sm:py-3 mx-2 sm:mx-4 border-b border-stone-400">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
        />
        <p className="flex-1 text-sm sm:text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) &&
          <span className="w-2 h-2 rounded-full !bg-green-500"></span>}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden w-5 h-5 sm:w-7 sm:h-7 cursor-pointer"
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      {/* ---------------chat Area--------------------------- */}
      <div 
        className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-2 sm:p-3 pb-6 relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragOver && (
          <div className="absolute inset-0 bg-violet-500/30 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-lg font-medium">Drop image here to send</p>
              <p className="text-sm opacity-80">Release to upload</p>
            </div>
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authUser._id
                ? "flex-row-reverse"
                : ""
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt=""
                className="max-w-[180px] sm:max-w-[230px] border border-gray-700 
          rounded-lg overflow-hidden"
              />
            ) : (
              <p
                className={`p-2 max-w-[150px] sm:max-w-[200px] text-xs sm:text-sm font-light 
                rounded-lg mb-8 break-all bg-violet-500/3 text-white 
                ${
                  msg.senderId === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id
                    ?authUser?.profilePic || assets.avatar_icon 
                    :selectedUser?.profilePic || assets.avatar_icon 
                    
                }
                alt=""
                className="w-5 h-5 sm:w-7 sm:h-7 rounded-full"
              />

              <p className="text-gray-500">
                {" "}
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>
      {/* -----------------------Bottom Area--------------------------------- */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 sm:gap-3 p-2 sm:p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-2 sm:px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            placeholder="Type a message or drag & drop images here"
            className="flex-1 text-xs sm:text-sm p-2 sm:p-3 border-none rounded-lg outline-none"
          />
          <input
            onChange={handleFileInputChange}
            type="file"
            id="image"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt=""
          className="w-5 h-5 sm:w-7 sm:h-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="" className="w-12 h-12 sm:w-16 sm:h-16" />
      <p className="text-sm sm:text-lg font-medium text-white text-center px-4">chat anytime anywhere</p>
      <p className="text-xs text-gray-400 text-center px-4">Drag & drop images to send them quickly</p>
    </div>
  );
};

export default ChatContainer;
