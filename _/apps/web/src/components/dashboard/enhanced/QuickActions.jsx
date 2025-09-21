import React from "react";
import { Upload, Calendar, FileText } from "lucide-react";

export default function QuickActions({ onUploadClick, onBookClick }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <button
        onClick={onUploadClick}
        className="glassmorphism rounded-2xl p-6 hover:bg-teal-500/10 transition-all duration-300 hover:scale-105"
      >
        <Upload
          className="mx-auto mb-4 text-teal-400 float-animation"
          size={32}
        />
        <h4 className="font-semibold mb-2">Upload Scan</h4>
        <p className="text-sm text-gray-400">Enhanced AI analysis</p>
      </button>

      <button
        onClick={onBookClick}
        className="glassmorphism rounded-2xl p-6 hover:bg-blue-500/10 transition-all duration-300 hover:scale-105"
      >
        <Calendar
          className="mx-auto mb-4 text-blue-400 pulse-glow"
          size={32}
        />
        <h4 className="font-semibold mb-2">Book Appointment</h4>
        <p className="text-sm text-gray-400">Calendar integration</p>
      </button>

      <button className="glassmorphism rounded-2xl p-6 hover:bg-purple-500/10 transition-all duration-300 hover:scale-105">
        <FileText
          className="mx-auto mb-4 text-purple-400 scan-animation"
          size={32}
        />
        <h4 className="font-semibold mb-2">View Reports</h4>
        <p className="text-sm text-gray-400">Multi-language support</p>
      </button>
    </div>
  );
}
