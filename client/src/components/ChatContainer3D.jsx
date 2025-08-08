import React, { useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Mic, 
  Paperclip, 
  Smile, 
  Search, 
  MoreVertical, 
  Pin, 
  Reply,
  Heart,
  ThumbsUp,
  Laugh,
  Frown,
  Angry,
  Play,
  Pause,
  ArrowLeft
} from "lucide-react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import VoiceRecorder from "./VoiceRecorder";
import toast from "react-hot-toast";

const ChatContainer3D = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const scrollEnd = useRef();
  const [input, setInput] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactions, setShowReactions] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);

  // Message reactions
  const reactions = [
    { icon: Heart, name: "heart", color: "text-red-500" },
    { icon: ThumbsUp, name: "like", color: "text-blue-500" },
    { icon: Laugh, name: "laugh", color: "text-yellow-500" },
    { icon: Frown, name: "sad", color: "text-gray-500" },
    { icon: Angry, name: "angry", color: "text-orange-500" },
  ];

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    
    const messageData = {
      text: input.trim(),
      replyTo: replyTo?._id
    };
    
    await sendMessage(messageData);
    setInput("");
    setReplyTo(null);
  };

  // Handle voice recording
  const handleVoiceRecord = () => {
    setShowVoiceRecorder(true);
  };

  // Handle voice message send
  const handleVoiceMessageSend = async (audioData) => {
    try {
      await sendMessage({ audio: audioData.audio });
    } catch (error) {
      toast.error("Failed to send voice message");
    }
  };

  // Handle audio playback
  const handleAudioPlay = (messageId, audioUrl) => {
    if (playingAudio === messageId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(messageId);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file) return;
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await sendMessage({ 
          file: {
            name: file.name,
            type: file.type,
            data: reader.result
          }
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload file");
    }
  };

  // Handle drag and drop
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    
    if (imageFiles.length > 0) {
      await handleFileUpload(imageFiles[0]);
      toast.success("Image uploaded successfully!");
    }
  };

  // Handle reaction
  const handleReaction = (messageId, reaction) => {
    // Reaction implementation
    toast.success(`Reacted with ${reaction}`);
  };

  // Filter messages based on search
  const filteredMessages = messages.filter(msg => 
    msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd?.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <motion.div 
      className="h-full flex flex-col overflow-hidden relative bg-gradient-to-b from-black/90 to-gray-900/90 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20, rotateY: 15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center gap-3 py-4 px-6 border-b border-gray-800 bg-gradient-to-r from-black/80 to-gray-900/80 glass-effect"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Mobile Back Button */}
        <motion.button
          onClick={() => setSelectedUser(null)}
          className="md:hidden p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>
        
        <motion.img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-10 h-10 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
        <div className="flex-1">
          <motion.p 
            className="text-lg font-semibold text-white flex items-center gap-2"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && (
              <motion.span 
                className="w-3 h-3 rounded-full bg-green-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.p>
          {isTyping && (
            <motion.p 
              className="text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              typing...
            </motion.p>
          )}
        </div>
        <motion.div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-accent-primary hover-lift"
          >
            <Search className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-accent-primary hover-lift"
          >
            <MoreVertical className="w-5 h-5 text-white" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Search Bar */}
      {searchQuery && (
        <motion.div 
          className="px-6 py-3 bg-gray-800/30"
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
        >
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-purple-500 outline-none"
          />
        </motion.div>
      )}

      {/* Chat Area */}
      <motion.div 
        className="flex flex-col flex-1 overflow-y-scroll p-4 space-y-4 min-h-0"
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
        onDrop={handleDrop}
      >
        <AnimatePresence>
          {isDragOver && (
            <motion.div 
              className="absolute inset-0 bg-purple-500/20 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center text-white">
                <motion.div 
                  className="text-6xl mb-4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  📷
                </motion.div>
                <p className="text-xl font-medium">Drop files here to send</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredMessages.map((msg, index) => (
          <motion.div
            key={msg._id || index}
            className={`flex items-end gap-3 ${
              msg.senderId !== authUser._id ? "flex-row-reverse" : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Reply Preview */}
            {msg.replyTo && (
              <motion.div 
                className="mb-2 p-2 bg-gray-700/30 rounded-lg text-sm text-gray-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Replying to: {msg.replyTo.text}
              </motion.div>
            )}

            {/* Message Content */}
            <motion.div
              className={`max-w-xs lg:max-w-md ${
                msg.senderId === authUser._id ? "ml-auto" : "mr-auto"
              }`}
            >
              {msg.image ? (
                <motion.img
                  src={msg.image}
                  alt=""
                  className="rounded-lg max-w-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              ) : msg.file ? (
                <motion.div
                  className="p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <Paperclip className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-white font-medium">{msg.file.name}</p>
                      <p className="text-sm text-gray-400">{msg.file.type}</p>
                    </div>
                  </div>
                </motion.div>
              ) : msg.audio ? (
                <motion.div
                  className={`p-3 rounded-2xl ${
                    msg.senderId === authUser._id
                      ? "bg-gradient-to-r from-purple-500 to-violet-600 rounded-br-md"
                      : "bg-gray-700 rounded-bl-md"
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={() => handleAudioPlay(msg._id, msg.audio)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-white/20"
                    >
                      {playingAudio === msg._id ? (
                        <Pause className="w-4 h-4 text-white" />
                      ) : (
                        <Play className="w-4 h-4 text-white" />
                      )}
                    </motion.button>
                    <div>
                      <p className="text-white text-sm">Voice Message</p>
                      <p className="text-gray-300 text-xs">Click to play</p>
                    </div>
                  </div>
                  {playingAudio === msg._id && (
                    <audio
                      src={msg.audio}
                      autoPlay
                      onEnded={() => setPlayingAudio(null)}
                    />
                  )}
                </motion.div>
              ) : (
                <motion.p
                  className={`p-3 rounded-2xl text-white ${
                    msg.senderId === authUser._id
                      ? "bg-gradient-to-r from-purple-500 to-violet-600 rounded-br-md"
                      : "bg-gray-700 rounded-bl-md"
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  {msg.text}
                </motion.p>
              )}

              {/* Message Actions */}
              <motion.div 
                className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.button
                  onClick={() => setReplyTo(msg)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
                >
                  <Reply className="w-4 h-4 text-gray-400" />
                </motion.button>
                <motion.button
                  onClick={() => setShowReactions(showReactions === msg._id ? null : msg._id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
                >
                  <Smile className="w-4 h-4 text-gray-400" />
                </motion.button>
              </motion.div>

              {/* Reactions */}
              {showReactions === msg._id && (
                <motion.div 
                  className="flex gap-1 mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {reactions.map((reaction) => (
                    <motion.button
                      key={reaction.name}
                      onClick={() => handleReaction(msg._id, reaction.name)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      className={`p-1 rounded-full bg-gray-700/50 hover:bg-gray-600/50 ${reaction.color}`}
                    >
                      <reaction.icon className="w-4 h-4" />
                    </motion.button>
                  ))}
                </motion.div>
              )}

              <motion.p 
                className="text-xs text-gray-500 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {formatMessageTime(msg.createdAt)}
              </motion.p>
            </motion.div>
          </motion.div>
        ))}
        <div ref={scrollEnd} />
      </motion.div>

      {/* Reply Preview */}
      {replyTo && (
        <motion.div 
          className="px-6 py-2 bg-gray-800/30 border-t border-gray-700"
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Reply className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Replying to: {replyTo.text}</span>
            </div>
            <motion.button
              onClick={() => setReplyTo(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-white"
            >
              ×
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <motion.div 
        className="relative p-4 bg-gradient-to-t from-gray-900/90 to-transparent border-t border-gray-700/50"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
          >
            <Paperclip className="w-5 h-5 text-white" />
          </motion.button>
          
          <motion.button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
          >
            <Smile className="w-5 h-5 text-white" />
          </motion.button>

          <motion.div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
              placeholder="Type a message..."
              className="w-full px-4 py-3 rounded-full bg-gray-700/50 text-white border border-gray-600 focus:border-purple-500 outline-none"
            />
          </motion.div>

          <motion.button
            onClick={handleVoiceRecord}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
          >
            <Mic className="w-5 h-5 text-white" />
          </motion.button>

          <motion.button
            onClick={handleSendMessage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
          >
            <Send className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </motion.div>

      {/* Voice Recorder Modal */}
      <AnimatePresence>
        {showVoiceRecorder && (
          <VoiceRecorder
            onSend={handleVoiceMessageSend}
            onClose={() => setShowVoiceRecorder(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  ) : (
    <motion.div 
      className="flex flex-col items-center justify-center h-full text-gray-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.img 
        src={assets.logo_icon} 
        alt="" 
        className="w-20 h-20 mb-4"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.p 
        className="text-xl font-medium text-white mb-2"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Welcome to 3D Chat
      </motion.p>
      <motion.p 
        className="text-sm text-gray-400 text-center"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Select a conversation to start chatting
      </motion.p>
    </motion.div>
  );
};

export default ChatContainer3D; 