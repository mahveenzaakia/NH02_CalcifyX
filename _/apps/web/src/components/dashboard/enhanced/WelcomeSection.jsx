import React from "react";
import Kidney3D from "@/components/dashboard/enhanced/Kidney3D";

export default function WelcomeSection({ profile, user, scans, animate3D, setAnimate3D }) {
  return (
    <div className="mb-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 neon-text">
            Welcome back, {profile?.full_name || user?.name || "User"}!
          </h2>
          <p className="text-gray-300">
            {profile?.user_type === "doctor"
              ? "Manage your patients and appointments"
              : "Track your kidney health journey"}
          </p>
        </div>
        <Kidney3D scans={scans} animate3D={animate3D} setAnimate3D={setAnimate3D} />
      </div>
    </div>
  );
}
