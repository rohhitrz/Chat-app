import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login}=useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    login(currentState==="Sign up"?'signup':'login',{fullName,email,password,bio})


  };

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center gap-4 sm:gap-8 sm:justify-evenly max-sm:flex-col p-4 overflow-hidden"
      style={{ perspective: 1200 }}
    >
      {/* Animated background accents */}
      <motion.div
        className="pointer-events-none absolute -top-10 -left-10 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 blur-3xl"
        initial={{ opacity: 0, x: -80, y: -80 }}
        animate={{ opacity: 1, x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-10 -right-10 w-96 h-96 rounded-full bg-gradient-to-tr from-fuchsia-500/20 to-purple-500/20 blur-3xl"
        initial={{ opacity: 0, x: 80, y: 80 }}
        animate={{ opacity: 1, x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* -----------------------left-------------------------- */}
      <motion.img
        src={assets.logo_big}
        alt=""
        className="w-[min(25vw,200px)] sm:w-[min(30vw,250px)] float-animation"
        initial={{ x: -100, opacity: 0, rotateY: -30 }}
        animate={{ x: 0, opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      />
      {/* -----------------------Right-------------------------- */}
      <motion.form
        onSubmit={handleSubmit}
        className="border glass-effect text-white border-gray-700 p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 rounded-2xl shadow-2xl w-full max-w-md"
        initial={{ x: 100, opacity: 0, rotateY: 15 }}
        animate={{ x: 0, opacity: 1, rotateY: 0 }}
        whileHover={{ rotateX: -3, rotateY: 4, scale: 1.02 }}
        transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 120 }}
      >
        <h2 className="font-medium text-xl sm:text-2xl flex justify-between items-center">
          {currentState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
            />
          )}
        </h2>
        {currentState === "Sign up" && !isDataSubmitted && (
          <input
            type="text"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            className="p-2 border border-gray-500 rounded-md 
          focus:outline-none"
            placeholder="Full Name"
            required
          />
        )}
        {!isDataSubmitted && (
          <>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 "
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </>
        )}
        {currentState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        )}

        <button
          type="submit"
          className="py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-md cursor-pointer text-sm sm:text-base shadow-lg hover:shadow-emerald-500/20"
        >
          {currentState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy Policy.</p>
        </div>

        <div className="flex flex-col gap-2">
          {currentState === "Sign up" ? (
            <p className="text-xs sm:text-sm text-gray-600 text-center">
              Already Have an Account{" "}
              <span
                onClick={() => {
                  setCurrentState("Login");
                  setIsDataSubmitted(false);
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-gray-600 text-center">
              Create An Account{" "}
              <span
                onClick={() => {
                  setCurrentState("Sign up");
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                click here
              </span>
            </p>
          )}
        </div>
      </motion.form>
    </div>
  );
};

export default LoginPage;
