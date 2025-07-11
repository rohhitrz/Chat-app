import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

//------------------------signup user------------------------------
export const Signup = async (req, res) => {
  const { fulName, email, password, bio } = req.body;

  try {
    if (!fulName || !email || !password || !bio) {
      return res.json({ success: false, message: "missing Details" });
    }
    const user = await User.findone({ email });
    if (user) {
      return res.json({ success: false, message: "user already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fulName,
      email,
      password: hashedPassword,
      bio,
    });
    const token = generateToken(newUser._id);
    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account Created Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findone({ email });
    if (userData) {
      res.json({
        success: false,
        message: "user does not exist, please register",
      });
    }
    const isPasswordCorrect = bcrypt.compare(password, userData.password);
    if (userData && !isPasswordCorrect) {
      res.json({ success: false, message: "Email or Password is wrong" });
    }
    const token = generateToken(userData._id);
    res.json({
      success: true,
      userData,
      token,
      message: "Logged In Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//controller to check if user is authenticated
export const checkAuth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

//controller to update user profile details

export const updateProfile = async () => {
  try {
    const { profilePic, bio, fullName } = req.body;

    const userId = req.user._id;
    let updatedUser;
    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const uplaod = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uplaod.secure_url, bio, fullName },
        { new: true }
      );
    }
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
