import React, { useState, useEffect } from "react";
import { Play, Upload, Brain, Users, Shield, Zap, ArrowRight, CheckCircle } from "lucide-react";
import useUser from "@/utils/useUser";

export default function LandingPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { data: user } = useUser();

  const demoSteps = [
    { title: "Upload Medical Scan", description: "Securely upload CT or MRI scans" },
    { title: "AI Analysis", description: "Advanced AI detects kidney stones" },
    { title: "Get Results", description: "Detailed reports with recommendations" },
    { title: "Book Appointment", description: "Connect with specialists if needed" }
  ];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % demoSteps.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, demoSteps.length]);

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0F2027] text-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .glassmorphism {
          background: rgba(20, 184, 166, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(20, 184, 166, 0.2);
        }
        
        .neon-glow {
          box-shadow: 0 0 20px rgba(20, 184, 166, 0.3);
        }
        
        .neon-text {
          text-shadow: 0 0 10px rgba(20, 184, 166, 0.5);
        }
        
        .kidney-pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        .scan-wave {
          animation: scanWave 3s infinite;
        }
        
        @keyframes scanWave {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        .float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      {/* Header */}
      <header className="relative z-50 px-6 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center neon-glow">
              <div className="w-5 h-5 bg-white/20 rounded-full"></div>
            </div>
            <span className="text-2xl font-bold neon-text">CalcifyX</span>
          </div>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <a
                href="/dashboard"
                className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-2 rounded-full font-medium hover:from-teal-600 hover:to-teal-700 transition-all duration-200 neon-glow"
              >
                Dashboard
              </a>
            ) : (
              <>
                <a
                  href="/account/signin"
                  className="text-teal-300 hover:text-white transition-colors duration-200"
                >
                  Sign In
                </a>
                <a
                  href="/account/signup"
                  className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-2 rounded-full font-medium hover:from-teal-600 hover:to-teal-700 transition-all duration-200 neon-glow"
                >
                  Get Started
                </a>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 mb-6 neon-glow kidney-pulse">
              <div className="w-12 h-12 bg-white/20 rounded-full"></div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-text">
              CalcifyX
            </h1>
            <p className="text-2xl md:text-3xl text-teal-300 mb-4">
              Smarter Kidney Care with AI
            </p>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Advanced AI-powered kidney stone detection and patient care assistant. 
              Upload scans, get instant analysis, and connect with specialists.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={startDemo}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-4 rounded-full font-medium text-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 neon-glow"
            >
              <Play size={20} />
              Watch Demo
            </button>
            <a
              href={user ? "/dashboard" : "/account/signup"}
              className="flex items-center justify-center gap-3 glassmorphism px-8 py-4 rounded-full font-medium text-lg hover:bg-teal-500/20 transition-all duration-200"
            >
              Get Started
              <ArrowRight size={20} />
            </a>
          </div>

          {/* Demo Visualization */}
          {isPlaying && (
            <div className="glassmorphism rounded-2xl p-8 max-w-4xl mx-auto mb-16">
              <h3 className="text-2xl font-bold mb-6">Interactive Demo</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {demoSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg transition-all duration-500 ${
                      index === currentStep
                        ? "bg-teal-500/30 border border-teal-400 neon-glow"
                        : index < currentStep
                        ? "bg-green-500/20 border border-green-400"
                        : "bg-gray-500/20 border border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-500/20 mx-auto mb-3">
                      {index < currentStep ? (
                        <CheckCircle size={24} className="text-green-400" />
                      ) : index === currentStep ? (
                        <div className="w-6 h-6 bg-teal-400 rounded-full kidney-pulse"></div>
                      ) : (
                        <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <h4 className="font-semibold mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-300">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 neon-text">Advanced Features</h2>
            <p className="text-xl text-gray-300">Cutting-edge technology for comprehensive kidney care</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain size={32} />,
                title: "AI-Powered Analysis",
                description: "Advanced machine learning algorithms detect kidney stones with high accuracy and provide detailed analysis."
              },
              {
                icon: <Upload size={32} />,
                title: "Secure Upload",
                description: "Upload CT and MRI scans securely with end-to-end encryption and HIPAA compliance."
              },
              {
                icon: <Users size={32} />,
                title: "Expert Network",
                description: "Connect with qualified urologists and nephrologists for professional consultation."
              },
              {
                icon: <Shield size={32} />,
                title: "Privacy First",
                description: "Your medical data is protected with enterprise-grade security and privacy measures."
              },
              {
                icon: <Zap size={32} />,
                title: "Instant Results",
                description: "Get comprehensive analysis results within minutes of uploading your scans."
              },
              {
                icon: <CheckCircle size={32} />,
                title: "Offline Support",
                description: "Access your reports and recommendations even without internet connectivity."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="glassmorphism rounded-2xl p-6 hover:bg-teal-500/10 transition-all duration-300 float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-teal-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glassmorphism rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-6 neon-text">
              Ready to Transform Your Kidney Care?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of patients and doctors using CalcifyX for smarter healthcare decisions.
            </p>
            <a
              href={user ? "/dashboard" : "/account/signup"}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-4 rounded-full font-medium text-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 neon-glow"
            >
              Start Your Journey
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-teal-500/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center">
              <div className="w-4 h-4 bg-white/20 rounded-full"></div>
            </div>
            <span className="text-xl font-bold neon-text">CalcifyX</span>
          </div>
          <p className="text-gray-400">
            © 2024 CalcifyX. Smarter Kidney Care with AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}