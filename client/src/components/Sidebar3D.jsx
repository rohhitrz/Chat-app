import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Menu, 
  Plus, 
  Users, 
  Pin, 
  Settings, 
  LogOut,
  UserPlus,
  Crown,
  Shield,
  MessageCircle,
  Phone,
  Video,
  MoreHorizontal
} from "lucide-react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import toast from "react-hot-toast";

const Sidebar3D = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [pinnedUsers, setPinnedUsers] = useState([]);

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUnseenMessages(prev => ({
      ...prev,
      [user._id]: 0
    }));
  };

  const handlePinUser = (userId) => {
    setPinnedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    setShowCreateGroup(true);
    toast.success("Group creation coming soon!");
  };

  const handleVideoCall = (user) => {
    toast.success(`Starting video call with ${user.fullName}`);
  };

  const handleVoiceCall = (user) => {
    toast.success(`Starting voice call with ${user.fullName}`);
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aPinned = pinnedUsers.includes(a._id);
    const bPinned = pinnedUsers.includes(b._id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  return (
    <motion.div 
      className="h-full flex flex-col bg-gradient-to-b from-black/90 to-gray-900/90 backdrop-blur-xl border-r border-gray-800/50 overflow-hidden"
      initial={{ x: -100, opacity: 0, rotateY: -15 }}
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
        <div className="flex items-center justify-between mb-6">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full flex items-center justify-center glow-animation"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <MessageCircle className="w-7 h-7 text-black font-bold" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold gradient-text">ChatApp</h2>
              <p className="text-xs text-gray-400">Next Generation</p>
            </div>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
          >
            <Settings className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Search Bar */}
        <motion.div 
          className="relative"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-800/50 text-white border border-gray-700 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all duration-300"
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex gap-2 mt-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={handleCreateGroup}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-black text-sm font-bold hover-lift neon-glow"
          >
            <Plus className="w-4 h-4" />
            New Group
          </motion.button>
          
          <motion.button
            onClick={() => navigate("/profile")}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-gray-800/50 text-white text-sm font-medium border border-gray-700 hover:border-accent-primary hover-lift"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Users List */}
      <motion.div 
        className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <AnimatePresence>
          {sortedUsers.map((user, index) => (
            <motion.div
              key={user._id}
              className={`relative group cursor-pointer rounded-xl p-3 transition-all duration-300 hover-lift ${
                selectedUser?._id === user._id 
                  ? "bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/50 neon-glow" 
                  : "bg-gray-800/30 hover:bg-gray-700/50 border border-transparent hover:border-gray-600"
              }`}
              initial={{ opacity: 0, x: -20, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ 
                scale: 1.03, 
                rotateY: 5,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUserSelect(user)}
            >
              {/* Pinned Indicator */}
              {pinnedUsers.includes(user._id) && (
                <motion.div
                  className="absolute top-2 right-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Pin className="w-4 h-4 text-yellow-500" />
                </motion.div>
              )}

              <div className="flex items-center gap-3">
                <motion.div className="relative">
                  <motion.img
                    src={user?.profilePic || assets.avatar_icon}
                    alt=""
                    className="w-12 h-12 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                  {onlineUsers?.includes(user._id) && (
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <motion.p 
                      className="font-medium text-white truncate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {user.fullName}
                    </motion.p>
                    
                    {/* Unread Messages Badge */}
                    {unseenMessages[user._id] > 0 && (
                      <motion.div
                        className="bg-gradient-to-r from-accent-primary to-accent-secondary text-black text-xs px-2 py-1 rounded-full font-bold pulse-animation"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {unseenMessages[user._id]}
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs ${
                      onlineUsers?.includes(user._id) 
                        ? "text-green-400" 
                        : "text-gray-400"
                    }`}>
                      {onlineUsers?.includes(user._id) ? "online" : "offline"}
                    </span>
                    
                    {user.role === "admin" && (
                      <Crown className="w-3 h-3 text-yellow-500" />
                    )}
                    {user.role === "moderator" && (
                      <Shield className="w-3 h-3 text-blue-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons (Visible on Hover) */}
              <motion.div 
                className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePinUser(user._id);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
                >
                  <Pin className={`w-3 h-3 ${
                    pinnedUsers.includes(user._id) ? "text-yellow-500" : "text-gray-400"
                  }`} />
                </motion.button>
                
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVoiceCall(user);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
                >
                  <Phone className="w-3 h-3 text-green-400" />
                </motion.button>
                
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVideoCall(user);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
                >
                  <Video className="w-3 h-3 text-blue-400" />
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredUsers.length === 0 && searchQuery && (
          <motion.div 
            className="text-center py-8 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No users found</p>
          </motion.div>
        )}
      </motion.div>

      {/* Footer */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50 bg-gradient-to-t from-gray-900/90 to-transparent"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-80 bg-gradient-to-b from-gray-800 to-gray-900 border-l border-gray-700 shadow-2xl"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Settings Header */}
              <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-purple-900/20 to-violet-900/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Settings</h3>
                  <motion.button
                    onClick={() => setShowSettings(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50"
                  >
                    <span className="text-white text-xl">×</span>
                  </motion.button>
                </div>
                <p className="text-gray-400 text-sm">Customize your chat experience</p>
              </div>

              {/* Settings Content */}
              <div className="p-6 space-y-4 overflow-y-auto h-[calc(100%-120px)]">
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/50 hover:to-gray-500/50 border border-gray-600/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">👤</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Profile Settings</p>
                        <p className="text-gray-400 text-sm">Manage your profile information</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/50 hover:to-gray-500/50 border border-gray-600/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">🔔</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Notification Settings</p>
                        <p className="text-gray-400 text-sm">Configure push notifications</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/50 hover:to-gray-500/50 border border-gray-600/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">🔒</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Privacy Settings</p>
                        <p className="text-gray-400 text-sm">Control your privacy options</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/50 hover:to-gray-500/50 border border-gray-600/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">🎨</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Theme Settings</p>
                        <p className="text-gray-400 text-sm">Customize app appearance</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/50 hover:to-gray-500/50 border border-gray-600/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">⚙️</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Advanced Settings</p>
                        <p className="text-gray-400 text-sm">Advanced configuration options</p>
                      </div>
                    </div>
                  </motion.button>
                </motion.div>

                {/* Settings Footer */}
                <motion.div
                  className="pt-6 border-t border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">ChatApp v2.0</p>
                    <p className="text-gray-500 text-xs">Next Generation Messaging</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Sidebar3D; 