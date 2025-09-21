import React from "react";
import { Volume2, Download } from "lucide-react";

export default function ReportCard({ scan, onTextToSpeech, onDownloadPDF }) {
  const ttsText = `Scan ${scan.id}: ${scan.stone_count} stones detected. Size: ${scan.max_stone_size} cm. Risk level: ${scan.risk_level}`;
  
  const statusConfig = {
    completed: "bg-green-400",
    processing: "bg-yellow-400 scan-animation",
    failed: "bg-red-400",
    default: "bg-gray-400",
  };
  
  const riskConfig = {
    high: "text-red-400",
    medium: "text-yellow-400",
    low: "text-green-400",
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium">{scan.scan_type} Scan</span>
        <div
          className={`w-3 h-3 rounded-full ${statusConfig[scan.analysis_status] || statusConfig.default}`}
        ></div>
      </div>

      <p className="text-sm text-gray-400 mb-3">
        {new Date(scan.upload_date).toLocaleDateString()}
      </p>

      {scan.analysis_status === "completed" && (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Stones:</span>
            <span className="font-medium">{scan.stone_count}</span>
          </div>
          {scan.max_stone_size && (
            <div className="flex justify-between text-sm">
              <span>Max Size:</span>
              <span className="font-medium">
                {scan.max_stone_size} cm
              </span>
            </div>
          )}
          {scan.risk_level && (
            <div className="flex justify-between text-sm">
              <span>Risk:</span>
              <span className={`font-medium capitalize ${riskConfig[scan.risk_level]}`}>
                {scan.risk_level}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onTextToSpeech(ttsText)}
          className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 py-2 px-3 rounded text-sm transition-all duration-200 flex items-center justify-center gap-1"
        >
          <Volume2 size={14} />
          Listen
        </button>

        {scan.analysis_status === "completed" && (
          <button
            onClick={() => onDownloadPDF(scan.id, "patient")}
            className="flex-1 bg-green-500/20 hover:bg-green-500/30 py-2 px-3 rounded text-sm transition-all duration-200 flex items-center justify-center gap-1"
          >
            <Download size={14} />
            PDF
          </button>
        )}
      </div>
    </div>
  );
}
