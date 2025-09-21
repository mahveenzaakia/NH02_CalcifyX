import React from "react";
import { Play, Pause } from "lucide-react";
import ReportCard from "@/components/dashboard/enhanced/ReportCard";
import { languages } from "@/utils/translations";

export default function ReportsSection({
  scans,
  isPlaying,
  handleTextToSpeech,
  downloadPDF,
  selectedLanguage,
}) {
  if (scans.length === 0) return null;
  
  const summaryText = `You have ${scans.length} scans. ${
    scans.filter((s) => s.analysis_status === "completed").length
  } are completed.`;

  return (
    <div className="glassmorphism rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold neon-text">Enhanced Reports</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleTextToSpeech(summaryText)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isPlaying
                ? "bg-red-500/20 text-red-400"
                : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
            }`}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            Listen ({languages[selectedLanguage].name})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scans.map((scan) => (
          <ReportCard
            key={scan.id}
            scan={scan}
            onTextToSpeech={handleTextToSpeech}
            onDownloadPDF={downloadPDF}
          />
        ))}
      </div>
    </div>
  );
}
