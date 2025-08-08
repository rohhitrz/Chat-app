import React, { useContext, useEffect, useState } from "react";
import assets, { imagesDummyData } from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = () => {

  const {selectedUser, messages}=useContext(ChatContext);
  const {logout,onlineUsers}=useContext(AuthContext);
  const [msgImages,setMsgImages]=useState(null);

  //get all images from the messages and set them to state

  useEffect(()=>{
    setMsgImages(
      messages.filter(msg=>msg.image).map(msg=>msg.image)
    )
  },[messages])

  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/5 text-white w-full relative overflow-y-scroll ${
          selectedUser ? "max-md:hidden" : "" }`}
      >
        <div className="pt-4 flex flex-col items-center gap-2 text-xs font-light mx-auto px-2">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            className="w-16 h-16 sm:w-20 sm:h-20 aspect-[1/1] rounded-full"
          />
          <h1 className="px-4 sm:px-10 text-lg sm:text-xl font-medium mx-auto flex items-center gap-2 text-center">
            {onlineUsers.includes(selectedUser._id) && <p className="w-2 h-2 rounded-full !bg-green-500"></p>}
            {selectedUser.fullName}
          </h1>
          <p className="px-4 sm:px-10 mx-auto text-center text-xs sm:text-sm">{selectedUser.bio}</p>
        </div>
        
        <hr className="border-[#ffffff50] my-4" />

        <div className="px-3 sm:px-5 text-xs">
          <p>Media</p>
          <div className="mt-2 max-h-[150px] overflow-y-scroll grid grid-cols-2 gap-2 sm:gap-4 opacity-80">
            {msgImages && msgImages.length > 0 ? (
              msgImages.map((url, index) => (
                <div
                  key={index}
                  onClick={() => window.open(url)}
                  className="cursor-pointer rounded"
                >
                  <img src={url} alt="" className="h-full rounded-md" />
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-xs">No media shared yet</p>
            )}
          </div>
        </div>
        <button onClick={()=>logout()}
         className="absolute bottom-2 left-1/2 transform -translate-x-1/2
         bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none 
         text-xs sm:text-sm font-light py-2 px-8 sm:px-20 rounded-full cursor-pointer"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default RightSidebar;
