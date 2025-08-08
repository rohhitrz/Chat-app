import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar3D from "../components/Sidebar3D";
import ChatContainer3D from "../components/ChatContainer3D";
import RightSidebar3D from "../components/RightSidebar3D";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);
  
  return (
    <motion.div 
      className="w-full h-screen p-2 sm:p-4 md:px-[5%] md:py-[3%] lg:px-[8%] lg:py-[5%] xl:px-[10%] xl:py-[8%] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`glass-effect border border-gray-800 rounded-3xl overflow-hidden flex-1 relative hover-lift`}
        initial={{ scale: 0.9, y: 20, rotateX: 15 }}
        animate={{ scale: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 255, 136, 0.2)"
        }}
      >
        {/* Desktop Layout */}
        <div className={`hidden md:grid h-full ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_3fr_1fr]"
            : "md:grid-cols-2"
        }`}>
          <Sidebar3D />
          <ChatContainer3D />
          <RightSidebar3D />
        </div>

        {/* Mobile Layout - WhatsApp Style */}
        <div className="md:hidden h-full relative">
          <AnimatePresence mode="wait">
            {!selectedUser ? (
              <motion.div
                key="sidebar"
                className="h-full"
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                exit={{ x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Sidebar3D />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                className="h-full"
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                exit={{ x: 100 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-full flex flex-col">
                  <ChatContainer3D />
                  <div className="hidden">
                    <RightSidebar3D />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
