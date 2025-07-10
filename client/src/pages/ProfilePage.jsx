import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

const ProfilePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/");
  };
  const navigate = useNavigate();
  const [name, setName] = useState("user");
  const [bio, setBio] = useState("");
  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div
        className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-500 border-2 border-gray-600 flex
      items-center justify-between max-sm:flex-col-reverse rounded-lg"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg"> Profile Detail</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setSelectedImage(e, target.files[0])}
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
              className={`w-12 h-12 ${selectedImage && "rounded-full"} `}
            />
            Uplaod Profile Image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your Name.."
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textArea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="write your bio..."
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}
          ></textArea>
          <button
            type="submit"
            className="py-3 bg-gradient-to-r from bg-purple-400 to-violet-600
         text-white rounded-md cursor-pointer"
          >
            Save
          </button>
        </form>
        <img
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
          src={assets.logo_icon}
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfilePage;
