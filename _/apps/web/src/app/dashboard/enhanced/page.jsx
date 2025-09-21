"use client";
import React, { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

import DashboardStyles from "@/components/dashboard/enhanced/DashboardStyles";
import Header from "@/components/dashboard/enhanced/Header";
import WelcomeSection from "@/components/dashboard/enhanced/WelcomeSection";
import StatsGrid from "@/components/dashboard/enhanced/StatsGrid";
import ScanUploader from "@/components/dashboard/enhanced/ScanUploader";
import ReportsSection from "@/components/dashboard/enhanced/ReportsSection";
import BookingModal from "@/components/dashboard/enhanced/BookingModal";
import QuickActions from "@/components/dashboard/enhanced/QuickActions";

export default function EnhancedDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showCalendar, setShowCalendar] = useState(false);
  const [animate3D, setAnimate3D] = useState(false);

  const { data: user, loading: userLoading } = useUser();
  const { isPlaying, handleTextToSpeech, stopSpeech } = useTextToSpeech(selectedLanguage);

  const {
    profile,
    scans,
    appointments,
    doctors,
    uploadScanMutation,
    bookAppointmentMutation,
    downloadPDF,
  } = useDashboardData(showCalendar);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleFileUpload = (file) => {
    if (!file) return;

    const allowedTypes = [".dcm", ".dicom", ".png", ".jpg", ".jpeg"];
    const fileExt = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
    if (!allowedTypes.includes(fileExt)) {
      alert("Please upload a valid medical scan file (DICOM, PNG, JPG)");
      return;
    }

    const mockUrl = `https://example.com/scans/${Date.now()}-${file.name}`;
    const scanType = file.name.toLowerCase().includes("ct") ? "CT" : "MRI";

    uploadScanMutation.mutate({
      scan_type: scanType,
      scan_file_url: mockUrl,
      filename: file.name,
      file_size: file.size,
    });
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0F2027] flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading CalcifyX...</div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/account/signin";
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0F2027] text-white">
      <DashboardStyles />

      <Header
        isOnline={isOnline}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        isPlaying={isPlaying}
        stopSpeech={stopSpeech}
        handleTextToSpeech={(text) => handleTextToSpeech(text, selectedLanguage)}
        setAnimate3D={setAnimate3D}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <WelcomeSection profile={profile} user={user} scans={scans} animate3D={animate3D} setAnimate3D={setAnimate3D} />
        <StatsGrid scans={scans} appointments={appointments} />
        <ScanUploader onFileUpload={handleFileUpload} />
        <ReportsSection
          scans={scans}
          isPlaying={isPlaying}
          handleTextToSpeech={(text) => handleTextToSpeech(text, selectedLanguage)}
          downloadPDF={downloadPDF}
          selectedLanguage={selectedLanguage}
        />
        <QuickActions
          onUploadClick={() => document.getElementById("enhanced-file-upload")?.click()}
          onBookClick={() => setShowCalendar(true)}
        />
      </main>

      <BookingModal
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
        doctors={doctors}
        bookAppointmentMutation={bookAppointmentMutation}
      />
    </div>
  );
}
