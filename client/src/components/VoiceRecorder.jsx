import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, Pause, Trash2, Send } from "lucide-react";
import toast from "react-hot-toast";

const VoiceRecorder = ({ onSend, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success("Recording started!");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording. Please check microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      toast.success("Recording stopped!");
    }
  };

  const playRecording = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  const sendRecording = () => {
    if (audioBlob) {
      onSend({ audio: audioBlob });
      deleteRecording();
      onClose();
      toast.success("Voice message sent!");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-800 rounded-2xl p-6 w-full max-w-md"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Voice Message</h3>
          <p className="text-gray-400 text-sm">Record your voice message</p>
        </div>

        {/* Recording Visualization */}
        <div className="mb-6">
          {isRecording && (
            <motion.div className="flex justify-center items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-8 bg-purple-500 rounded-full"
                  animate={{
                    height: [8, 32, 8],
                    backgroundColor: ["#8b5cf6", "#ec4899", "#8b5cf6"]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
          )}

          {audioUrl && !isRecording && (
            <motion.div 
              className="flex items-center justify-center gap-4 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.button
                onClick={playRecording}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-full bg-purple-600 hover:bg-purple-700"
              >
                {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
              </motion.button>
              
              <div className="text-center">
                <p className="text-white font-medium">Recording</p>
                <p className="text-gray-400 text-sm">{formatTime(recordingTime)}</p>
              </div>
            </motion.div>
          )}

          {!audioUrl && !isRecording && (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Mic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Click the microphone to start recording</p>
            </motion.div>
          )}
        </div>

        {/* Timer */}
        {isRecording && (
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-2xl font-bold text-white">{formatTime(recordingTime)}</p>
            <p className="text-sm text-gray-400">Recording...</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <AnimatePresence>
            {!audioUrl && !isRecording && (
              <motion.button
                onClick={startRecording}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Mic className="w-6 h-6 text-white" />
              </motion.button>
            )}

            {isRecording && (
              <motion.button
                onClick={stopRecording}
                className="p-4 rounded-full bg-gray-600 hover:bg-gray-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Square className="w-6 h-6 text-white" />
              </motion.button>
            )}

            {audioUrl && !isRecording && (
              <>
                <motion.button
                  onClick={deleteRecording}
                  className="p-4 rounded-full bg-gray-600 hover:bg-gray-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Trash2 className="w-6 h-6 text-white" />
                </motion.button>

                <motion.button
                  onClick={sendRecording}
                  className="p-4 rounded-full bg-green-600 hover:bg-green-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Send className="w-6 h-6 text-white" />
                </motion.button>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Audio Element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default VoiceRecorder; 