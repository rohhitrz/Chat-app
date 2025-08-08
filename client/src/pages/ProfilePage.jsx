import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    const render = new FileReader();
    render.readAsDataURL(selectedImage);
    render.onload = async () => {
      const base64Image = render.result();
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate("/");
    };
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl glass-effect text-gray-300 border-2 border-gray-700 flex
      items-center justify-between max-sm:flex-col-reverse rounded-2xl hover-lift"
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 sm:gap-5 p-4 sm:p-6 md:p-10 flex-1"
        >
          <h3 className="text-base sm:text-lg"> Profile Detail</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setSelectedImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpeg, .jpg"
              hidden
            />
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : assets.avatar_icon
              }
              className={`w-10 h-10 sm:w-12 sm:h-12 ${selectedImage && "rounded-full"} `}
            />
            <span className="text-sm sm:text-base">Upload Profile Image</span>
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your Name.."
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Your bio..."
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}
          ></textarea>
          <button
            type="submit"
            className="py-2 sm:py-3 bg-gradient-to-r from-purple-400 to-violet-600
         text-white rounded-md cursor-pointer text-sm sm:text-base"
          >
            Save
          </button>
        </form>
        <img
          className={`w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 aspect-square rounded-full mx-4 sm:mx-6 md:mx-10 max-sm:mt-6 ${selectedImage && "rounded-full"}`}
          src={ authUser?.profilePic || assets.logo_icon}
          alt=""
        />
      </motion.div>
    </div>
  );
};

export default ProfilePage;
