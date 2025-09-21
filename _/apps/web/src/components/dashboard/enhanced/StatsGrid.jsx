import React from "react";
import {
  FileText,
  Calendar,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function StatsGrid({ scans, appointments }) {
  const stats = [
    {
      title: "Total Scans",
      count: scans.length,
      icon: FileText,
      color: "teal",
      animation: "scan-animation",
    },
    {
      title: "Appointments",
      count: appointments.length,
      icon: Calendar,
      color: "blue",
      animation: "float-animation",
    },
    {
      title: "Completed",
      count: scans.filter((s) => s.analysis_status === "completed").length,
      icon: CheckCircle,
      color: "green",
      animation: "pulse-glow",
    },
    {
      title: "Risk Level",
      count: scans.find((s) => s.risk_level)?.risk_level || "Low",
      icon: AlertTriangle,
      color: "orange",
      animation: "float-animation",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`glassmorphism rounded-2xl p-6 hover:scale-105 transition-all duration-300 ${stat.animation}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full bg-${stat.color}-500/20`}>
              <stat.icon className={`text-${stat.color}-400`} size={24} />
            </div>
            <span className="text-2xl font-bold">{stat.count}</span>
          </div>
          <h3 className="font-semibold mb-1">{stat.title}</h3>
          <p className="text-sm text-gray-400">Updated just now</p>
        </div>
      ))}
    </div>
  );
}
