import React from "react";
import { Upload, Brain } from "lucide-react";

export default function ScanUploader({ onFileUpload }) {
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="glassmorphism rounded-2xl p-8 mb-8">
      <h3 className="text-2xl font-bold mb-6 neon-text flex items-center gap-3">
        <Upload className="animate-bounce" />
        Enhanced Scan Upload
      </h3>

      <div className="border-2 border-dashed border-teal-500/30 rounded-2xl p-12 text-center hover:border-teal-400 hover:bg-teal-500/5 transition-all duration-300">
        <div className="w-16 h-16 mx-auto rounded-full bg-teal-500/20 flex items-center justify-center mb-4 float-animation">
          <Brain className="text-teal-400" size={32} />
        </div>
        <h4 className="text-lg font-semibold mb-2">
          Drop your medical scan here
        </h4>
        <p className="text-gray-400 mb-4">
          Supports DICOM, CT, MRI, X-Ray files
        </p>
        <p className="text-sm text-yellow-400 mb-4">
          ⚠️ Colored images will be rejected automatically
        </p>

        <input
          type="file"
          accept=".dcm,.dicom,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
          id="enhanced-file-upload"
        />
        <label
          htmlFor="enhanced-file-upload"
          className="inline-block bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-3 rounded-lg font-medium cursor-pointer hover:from-teal-600 hover:to-teal-700 transition-all duration-200 neon-glow"
        >
          Choose File
        </label>
      </div>
    </div>
  );
}
