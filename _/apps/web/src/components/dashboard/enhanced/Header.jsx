import React from "react";
import { Settings, Bell, LogOut, Volume2, VolumeX } from "lucide-react";
import useAuth from "@/utils/useAuth";
import { languages } from "@/utils/translations";

export default function Header({
  isOnline,
  selectedLanguage,
  setSelectedLanguage,
  isPlaying,
  stopSpeech,
  handleTextToSpeech,
  setAnimate3D,
}) {
  const { signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 glassmorphism border-b border-teal-500/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center neon-glow cursor-pointer float-animation"
            onClick={() => setAnimate3D((prev) => !prev)}
          >
            <div className="w-5 h-5 bg-white/20 rounded-full"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold neon-text">CalcifyX Enhanced</h1>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400 pulse-glow" : "bg-red-400"}`}
              ></div>
              <span className="text-xs text-gray-300">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-black/30 border border-teal-500/30 rounded-lg px-3 py-1 text-sm text-white"
          >
            {Object.entries(languages).map(([code, lang]) => (
              <option key={code} value={code} className="bg-gray-800">
                {lang.name}
              </option>
            ))}
          </select>

          <button
            onClick={
              isPlaying
                ? stopSpeech
                : () => handleTextToSpeech("Welcome to CalcifyX Enhanced Dashboard")
            }
            className={`p-2 rounded-full glassmorphism transition-all duration-200 ${
              isPlaying
                ? "bg-red-500/20 text-red-400"
                : "bg-teal-500/20 text-teal-400 hover:bg-teal-500/30"
            }`}
          >
            {isPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <button className="p-2 rounded-full glassmorphism hover:bg-teal-500/20 transition-all duration-200">
            <Bell size={20} />
          </button>
          <button className="p-2 rounded-full glassmorphism hover:bg-teal-500/20 transition-all duration-200">
            <Settings size={20} />
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/", redirect: true })}
            className="p-2 rounded-full glassmorphism hover:bg-red-500/20 transition-all duration-200"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
