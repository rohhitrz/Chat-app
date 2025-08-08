import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image, 
  FileText, 
  Download, 
  Share2, 
  MoreVertical, 
  Phone, 
  Video, 
  Mail,
  MapPin,
  Calendar,
  Star,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const RightSidebar3D = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [showMedia, setShowMedia] = useState(true);
  const [showFiles, setShowFiles] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Extract media and files from messages
  const mediaFiles = messages.filter(msg => msg.image).map(msg => ({
    type: "image",
    url: msg.image,
    timestamp: msg.createdAt,
    sender: msg.senderId
  }));

  const documentFiles = messages.filter(msg => msg.file).map(msg => ({
    type: "document",
    name: msg.file.name,
    url: msg.file.data,
    timestamp: msg.createdAt,
    sender: msg.senderId
  }));

  const allFiles = [...mediaFiles, ...documentFiles];

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "media", label: "Media", icon: "📷", count: mediaFiles.length },
    { id: "files", label: "Files", icon: "📁", count: documentFiles.length },
    { id: "shared", label: "Shared", icon: "🔗" }
  ];

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name || 'download';
    link.click();
    toast.success("Download started!");
  };

  const handleShare = (file) => {
    navigator.share({
      title: file.name || 'Shared file',
      url: file.url
    }).catch(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  const handleDelete = (file) => {
    toast.success("Delete feature coming soon!");
  };

  if (!selectedUser) return null;

  return (
    <motion.div 
      className="h-full flex flex-col bg-gradient-to-b from-black/90 to-gray-900/90 backdrop-blur-xl border-l border-gray-800/50 overflow-hidden"
      initial={{ x: 100, opacity: 0, rotateY: 15 }}
      animate={{ x: 0, opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      {/* Header */}
      <motion.div 
        className="p-6 border-b border-gray-700/50"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Details</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
          >
            <MoreVertical className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* User Profile */}
        <motion.div 
          className="text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div className="relative inline-block">
            <motion.img
              src={selectedUser?.profilePic || assets.avatar_icon}
              alt=""
              className="w-20 h-20 rounded-full mx-auto mb-3"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
            {onlineUsers.includes(selectedUser._id) && (
              <motion.div
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
          
          <motion.h3 
            className="text-lg font-semibold text-white mb-1"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {selectedUser.fullName}
          </motion.h3>
          
          <motion.p 
            className="text-sm text-gray-400 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {selectedUser.bio || "No bio available"}
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            className="flex justify-center gap-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-green-600 hover:bg-green-700"
              onClick={() => toast.success("Voice call coming soon!")}
            >
              <Phone className="w-4 h-4 text-white" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-700"
              onClick={() => toast.success("Video call coming soon!")}
            >
              <Video className="w-4 h-4 text-white" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-purple-600 hover:bg-purple-700"
              onClick={() => toast.success("Email coming soon!")}
            >
              <Mail className="w-4 h-4 text-white" />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        className="flex border-b border-gray-700/50"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <motion.span
                className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {tab.count}
              </motion.span>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div 
        className="flex-1 overflow-y-auto p-4 min-h-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Location</p>
                    <p className="text-sm text-gray-400">Not specified</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Member since</p>
                    <p className="text-sm text-gray-400">2024</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30">
                  <Star className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Status</p>
                    <p className="text-sm text-green-400">Active</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "media" && (
            <motion.div
              key="media"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {mediaFiles.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {mediaFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      className="relative group cursor-pointer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedMedia(file)}
                    >
                      <img
                        src={file.url}
                        alt=""
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <motion.div
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(file);
                          }}
                          className="p-1 rounded-full bg-white/20"
                        >
                          <Download className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(file);
                          }}
                          className="p-1 rounded-full bg-white/20"
                        >
                          <Share2 className="w-4 h-4 text-white" />
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-8 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No media shared yet</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "files" && (
            <motion.div
              key="files"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {documentFiles.length > 0 ? (
                documentFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    className="p-3 rounded-lg bg-gray-700/30 border border-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-white font-medium">{file.name}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(file.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDownload(file)}
                          className="p-1 rounded-full bg-gray-600/50 hover:bg-gray-600"
                        >
                          <Download className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleShare(file)}
                          className="p-1 rounded-full bg-gray-600/50 hover:bg-gray-600"
                        >
                          <Share2 className="w-4 h-4 text-white" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="text-center py-8 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No files shared yet</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "shared" && (
            <motion.div
              key="shared"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center py-8 text-gray-400">
                <Share2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Shared content coming soon!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Media Preview Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              className="relative max-w-2xl max-h-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedMedia.url}
                alt=""
                className="w-full h-full object-contain rounded-lg"
              />
              <motion.button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RightSidebar3D; 