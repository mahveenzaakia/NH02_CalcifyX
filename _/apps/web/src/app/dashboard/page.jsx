import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { 
  Upload, Brain, Calendar, FileText, Users, Settings, 
  Bell, LogOut, Activity, TrendingUp, AlertTriangle,
  Play, Volume2, Download, Eye, Clock, CheckCircle
} from "lucide-react";
import useUser from "@/utils/useUser";
import useAuth from "@/utils/useAuth";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isOnline, setIsOnline] = useState(true);
  const { data: user, loading: userLoading } = useUser();
  const { signOut } = useAuth();
  const queryClient = useQueryClient();

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch user profile
  const { data: profileData } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await fetch('/api/user-profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    enabled: !!user
  });

  // Fetch scans
  const { data: scansData, isLoading: scansLoading } = useQuery({
    queryKey: ['scans'],
    queryFn: async () => {
      const response = await fetch('/api/scans');
      if (!response.ok) throw new Error('Failed to fetch scans');
      return response.json();
    },
    enabled: !!user,
    refetchInterval: 5000 // Refetch every 5 seconds for real-time updates
  });

  // Fetch appointments
  const { data: appointmentsData } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await fetch('/api/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      return response.json();
    },
    enabled: !!user
  });

  // Fetch recommendations
  const { data: recommendationsData } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const response = await fetch('/api/recommendations');
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return response.json();
    },
    enabled: !!user
  });

  const scans = scansData?.scans || [];
  const appointments = appointmentsData?.appointments || [];
  const recommendations = recommendationsData?.recommendations || [];
  const profile = profileData?.profile;

  // Create profile if it doesn't exist
  const createProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      if (!response.ok) throw new Error('Failed to create profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    }
  });

  // Handle sign out
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  // Generate chart data
  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      scans: Math.floor(Math.random() * 5) + 1,
      stones: Math.floor(Math.random() * 3)
    }));
  };

  const chartData = generateChartData();

  // Risk level colors
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0F2027] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/account/signin';
    return null;
  }

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
        
        .scan-animation {
          animation: scanPulse 2s infinite;
        }
        
        @keyframes scanPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        
        .kidney-3d {
          background: radial-gradient(circle at 30% 30%, #14b8a6, #0d9488);
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 glassmorphism border-b border-teal-500/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center neon-glow">
              <div className="w-5 h-5 bg-white/20 rounded-full"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold neon-text">CalcifyX</h1>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-xs text-gray-300">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {['overview', 'scans', 'reports', 'appointments', 'lifestyle'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-teal-500 text-white neon-glow'
                    : 'text-teal-300 hover:text-white hover:bg-teal-500/20'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full glassmorphism hover:bg-teal-500/20 transition-all duration-200">
              <Bell size={20} />
            </button>
            <button className="p-2 rounded-full glassmorphism hover:bg-teal-500/20 transition-all duration-200">
              <Settings size={20} />
            </button>
            <button 
              onClick={handleSignOut}
              className="p-2 rounded-full glassmorphism hover:bg-red-500/20 transition-all duration-200"
            >
              <LogOut size={20} />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center">
              <span className="text-sm font-semibold">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 neon-text">
            Welcome back, {profile?.full_name || user?.name || 'User'}!
          </h2>
          <p className="text-gray-300">
            {profile?.user_type === 'doctor' ? 'Manage your patients and appointments' : 'Track your kidney health journey'}
          </p>
        </div>

        {/* Profile Setup Prompt */}
        {!profile && (
          <div className="glassmorphism rounded-2xl p-6 mb-8 border border-yellow-500/30">
            <div className="flex items-center gap-4">
              <AlertTriangle className="text-yellow-400" size={24} />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-400">Complete Your Profile</h3>
                <p className="text-gray-300">Set up your profile to get personalized recommendations</p>
              </div>
              <button
                onClick={() => createProfileMutation.mutate({
                  user_type: 'patient',
                  full_name: user?.name || 'User'
                })}
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-200"
              >
                Complete Profile
              </button>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glassmorphism rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-teal-500/20">
                    <FileText className="text-teal-400" size={24} />
                  </div>
                  <span className="text-2xl font-bold">{scans.length}</span>
                </div>
                <h3 className="font-semibold mb-1">Total Scans</h3>
                <p className="text-sm text-gray-400">Medical scans uploaded</p>
              </div>

              <div className="glassmorphism rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <Calendar className="text-blue-400" size={24} />
                  </div>
                  <span className="text-2xl font-bold">{appointments.length}</span>
                </div>
                <h3 className="font-semibold mb-1">Appointments</h3>
                <p className="text-sm text-gray-400">Scheduled consultations</p>
              </div>

              <div className="glassmorphism rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-green-500/20">
                    <Activity className="text-green-400" size={24} />
                  </div>
                  <span className="text-2xl font-bold">
                    {scans.filter(s => s.analysis_status === 'completed').length}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Completed</h3>
                <p className="text-sm text-gray-400">Analysis completed</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glassmorphism rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('scans')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 transition-all duration-200"
                >
                  <Upload size={20} className="text-teal-400" />
                  <span>Upload New Scan</span>
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-all duration-200"
                >
                  <Calendar size={20} className="text-blue-400" />
                  <span>Book Appointment</span>
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-all duration-200"
                >
                  <FileText size={20} className="text-purple-400" />
                  <span>View Reports</span>
                </button>
              </div>
            </div>

            {/* Health Trends Chart */}
            <div className="lg:col-span-2 glassmorphism rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Health Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #14B8A6',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line type="monotone" dataKey="scans" stroke="#14B8A6" strokeWidth={2} />
                    <Line type="monotone" dataKey="stones" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glassmorphism rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {scans.slice(0, 3).map((scan, index) => (
                  <div key={scan.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                    <div className={`w-3 h-3 rounded-full ${
                      scan.analysis_status === 'completed' ? 'bg-green-400' :
                      scan.analysis_status === 'processing' ? 'bg-yellow-400 scan-animation' :
                      scan.analysis_status === 'failed' ? 'bg-red-400' : 'bg-gray-400'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{scan.scan_type} Scan</p>
                      <p className="text-xs text-gray-400">
                        {new Date(scan.upload_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs capitalize text-gray-400">
                      {scan.analysis_status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scans Tab */}
        {activeTab === 'scans' && (
          <ScanUploadSection 
            scans={scans} 
            isLoading={scansLoading}
            onRefresh={() => queryClient.invalidateQueries({ queryKey: ['scans'] })}
          />
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <ReportsSection scans={scans} />
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <AppointmentsSection 
            appointments={appointments}
            onRefresh={() => queryClient.invalidateQueries({ queryKey: ['appointments'] })}
          />
        )}

        {/* Lifestyle Tab */}
        {activeTab === 'lifestyle' && (
          <LifestyleSection recommendations={recommendations} />
        )}
      </main>
    </div>
  );
}

// Scan Upload Section Component
function ScanUploadSection({ scans, isLoading, onRefresh }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const uploadScanMutation = useMutation({
    mutationFn: async (scanData) => {
      const response = await fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scanData)
      });
      if (!response.ok) throw new Error('Failed to upload scan');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scans'] });
      setUploading(false);
    },
    onError: () => {
      setUploading(false);
    }
  });

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate file upload (in real app, use actual file upload)
    const mockUrl = `https://example.com/scans/${Date.now()}-${file.name}`;
    const scanType = file.name.toLowerCase().includes('ct') ? 'CT' : 
                    file.name.toLowerCase().includes('mri') ? 'MRI' : 'CT';
    
    uploadScanMutation.mutate({
      scan_type: scanType,
      scan_file_url: mockUrl
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="glassmorphism rounded-2xl p-8">
        <h3 className="text-2xl font-bold mb-6 neon-text">Upload Medical Scan</h3>
        
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-teal-400 bg-teal-500/10' 
              : 'border-teal-500/30 hover:border-teal-400 hover:bg-teal-500/5'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-teal-500/20 flex items-center justify-center scan-animation">
                <Brain className="text-teal-400" size={32} />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Processing Scan...</h4>
                <p className="text-gray-400">AI analysis in progress</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-teal-500/20 flex items-center justify-center">
                <Upload className="text-teal-400" size={32} />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Drop your scan files here</h4>
                <p className="text-gray-400">or click to browse (CT, MRI, X-Ray)</p>
              </div>
              <input
                type="file"
                accept=".dcm,.jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block bg-teal-500 hover:bg-teal-600 px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors duration-200"
              >
                Choose File
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Scans List */}
      <div className="glassmorphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Your Scans</h3>
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 transition-colors duration-200"
          >
            <Activity size={20} className="text-teal-400" />
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="scan-animation text-teal-400">Loading scans...</div>
          </div>
        ) : scans.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No scans uploaded yet. Upload your first scan to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scans.map((scan) => (
              <div key={scan.id} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{scan.scan_type} Scan</span>
                  <div className={`w-3 h-3 rounded-full ${
                    scan.analysis_status === 'completed' ? 'bg-green-400' :
                    scan.analysis_status === 'processing' ? 'bg-yellow-400 scan-animation' :
                    scan.analysis_status === 'failed' ? 'bg-red-400' : 'bg-gray-400'
                  }`}></div>
                </div>
                
                <p className="text-sm text-gray-400 mb-3">
                  {new Date(scan.upload_date).toLocaleDateString()}
                </p>

                {scan.analysis_status === 'completed' && scan.stone_count !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Stones Detected:</span>
                      <span className="font-medium">{scan.stone_count}</span>
                    </div>
                    {scan.max_stone_size && (
                      <div className="flex justify-between text-sm">
                        <span>Max Size:</span>
                        <span className="font-medium">{scan.max_stone_size} cm</span>
                      </div>
                    )}
                    {scan.risk_level && (
                      <div className="flex justify-between text-sm">
                        <span>Risk Level:</span>
                        <span 
                          className="font-medium capitalize"
                          style={{ color: getRiskColor(scan.risk_level) }}
                        >
                          {scan.risk_level}
                        </span>
                      </div>
                    )}
                    {scan.requires_appointment && (
                      <div className="mt-3 p-2 bg-orange-500/20 border border-orange-500/30 rounded text-sm text-orange-300">
                        ⚠️ Appointment recommended
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-teal-500/20 hover:bg-teal-500/30 py-2 px-3 rounded text-sm transition-colors duration-200">
                    <Eye size={16} className="inline mr-1" />
                    View
                  </button>
                  {scan.analysis_status === 'completed' && (
                    <button className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 py-2 px-3 rounded text-sm transition-colors duration-200">
                      <Download size={16} className="inline mr-1" />
                      Report
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Reports Section Component
function ReportsSection({ scans }) {
  const [selectedScan, setSelectedScan] = useState(null);
  const [reportType, setReportType] = useState('patient');
  const [isPlaying, setIsPlaying] = useState(false);

  const completedScans = scans.filter(scan => scan.analysis_status === 'completed');

  const handleTextToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glassmorphism rounded-2xl p-6">
        <h3 className="text-2xl font-bold mb-6 neon-text">Medical Reports</h3>

        {completedScans.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h4 className="text-lg font-semibold mb-2">No Reports Available</h4>
            <p className="text-gray-400">Upload and analyze scans to generate reports</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reports List */}
            <div className="space-y-4">
              <h4 className="font-semibold">Available Reports</h4>
              {completedScans.map((scan) => (
                <button
                  key={scan.id}
                  onClick={() => setSelectedScan(scan)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                    selectedScan?.id === scan.id
                      ? 'bg-teal-500/20 border border-teal-400'
                      : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{scan.scan_type} Report</span>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${getRiskColor(scan.risk_level)}20`,
                        color: getRiskColor(scan.risk_level)
                      }}
                    >
                      {scan.risk_level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(scan.upload_date).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>

            {/* Report Viewer */}
            <div className="lg:col-span-2">
              {selectedScan ? (
                <div className="space-y-6">
                  {/* Report Type Toggle */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReportType('patient')}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        reportType === 'patient'
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Patient Report
                    </button>
                    <button
                      onClick={() => setReportType('doctor')}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        reportType === 'doctor'
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Doctor Report
                    </button>
                  </div>

                  {/* Report Content */}
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-lg font-semibold">
                        {reportType === 'patient' ? 'Patient-Friendly Report' : 'Technical Report'}
                      </h5>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTextToSpeech(
                            reportType === 'patient' 
                              ? `Your scan shows ${selectedScan.stone_count} kidney stones detected. The largest stone is ${selectedScan.max_stone_size} centimeters. Your risk level is ${selectedScan.risk_level}.`
                              : `Technical analysis: ${selectedScan.stone_count} calcifications detected. Maximum diameter: ${selectedScan.max_stone_size}cm. Risk stratification: ${selectedScan.risk_level}.`
                          )}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            isPlaying 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                          }`}
                        >
                          <Volume2 size={16} />
                        </button>
                        <button className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all duration-200">
                          <Download size={16} />
                        </button>
                      </div>
                    </div>

                    {reportType === 'patient' ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-700/50 rounded-lg p-4">
                            <h6 className="font-medium mb-2">Stones Found</h6>
                            <p className="text-2xl font-bold text-teal-400">{selectedScan.stone_count}</p>
                          </div>
                          <div className="bg-gray-700/50 rounded-lg p-4">
                            <h6 className="font-medium mb-2">Largest Stone</h6>
                            <p className="text-2xl font-bold text-orange-400">{selectedScan.max_stone_size} cm</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <h6 className="font-medium mb-2">What This Means</h6>
                          <p className="text-gray-300">
                            {selectedScan.risk_level === 'high' 
                              ? 'Your scan shows kidney stones that may require medical attention. We recommend scheduling an appointment with a specialist.'
                              : selectedScan.risk_level === 'medium'
                              ? 'Your scan shows kidney stones that should be monitored. Follow up with your doctor for guidance.'
                              : 'Your scan shows small kidney stones. Continue with preventive care and lifestyle modifications.'
                            }
                          </p>
                        </div>

                        {/* 3D Kidney Visualization */}
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <h6 className="font-medium mb-4">3D Kidney Model</h6>
                          <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                            <div className="kidney-3d w-32 h-20 relative">
                              {/* Stone indicators */}
                              {Array.from({ length: selectedScan.stone_count }, (_, i) => (
                                <div
                                  key={i}
                                  className="absolute w-2 h-2 bg-red-400 rounded-full animate-pulse"
                                  style={{
                                    top: `${20 + i * 15}%`,
                                    left: `${30 + i * 10}%`
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <h6 className="font-medium mb-2">Technical Analysis</h6>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Scan Type:</span>
                              <span className="ml-2 font-medium">{selectedScan.scan_type}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Confidence:</span>
                              <span className="ml-2 font-medium">{(selectedScan.confidence_score * 100).toFixed(1)}%</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Calcifications:</span>
                              <span className="ml-2 font-medium">{selectedScan.stone_count}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Max Diameter:</span>
                              <span className="ml-2 font-medium">{selectedScan.max_stone_size} cm</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <h6 className="font-medium mb-2">Clinical Recommendations</h6>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• {selectedScan.requires_appointment ? 'Immediate specialist consultation recommended' : 'Routine follow-up appropriate'}</li>
                            <li>• Monitor for symptom progression</li>
                            <li>• Consider metabolic evaluation if recurrent</li>
                            <li>• Lifestyle modifications as indicated</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-400">Select a report to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Appointments Section Component
function AppointmentsSection({ appointments, onRefresh }) {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const queryClient = useQueryClient();

  const { data: doctorsData } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const response = await fetch('/api/doctors');
      if (!response.ok) throw new Error('Failed to fetch doctors');
      return response.json();
    }
  });

  const doctors = doctorsData?.doctors || [];

  const bookAppointmentMutation = useMutation({
    mutationFn: async (appointmentData) => {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });
      if (!response.ok) throw new Error('Failed to book appointment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setShowBooking(false);
      setSelectedDoctor(null);
    }
  });

  const handleBookAppointment = (doctorId, date) => {
    bookAppointmentMutation.mutate({
      doctor_id: doctorId,
      appointment_date: date,
      notes: 'Kidney stone consultation'
    });
  };

  return (
    <div className="space-y-6">
      <div className="glassmorphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold neon-text">Appointments</h3>
          <button
            onClick={() => setShowBooking(true)}
            className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Book Appointment
          </button>
        </div>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <h4 className="text-lg font-semibold mb-2">No Appointments Scheduled</h4>
            <p className="text-gray-400">Book your first appointment with a specialist</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{appointment.doctor_name}</h4>
                    <p className="text-sm text-gray-400">{appointment.specialization}</p>
                    <p className="text-sm text-gray-400">{appointment.hospital_affiliation}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Date(appointment.appointment_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(appointment.appointment_date).toLocaleTimeString()}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      appointment.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                      appointment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glassmorphism rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Book Appointment</h3>
              <button
                onClick={() => setShowBooking(false)}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor.user_id}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                    selectedDoctor?.user_id === doctor.user_id
                      ? 'border-teal-400 bg-teal-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center">
                      <span className="font-semibold">
                        {doctor.full_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{doctor.full_name}</h4>
                      <p className="text-sm text-gray-400">{doctor.specialization}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span>{doctor.years_experience} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span className="text-yellow-400">★ {doctor.rating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reviews:</span>
                      <span>{doctor.total_reviews}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-2">{doctor.hospital_affiliation}</p>
                </div>
              ))}
            </div>

            {selectedDoctor && (
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-semibold mb-4">Select Date & Time</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i + 1);
                    date.setHours(9 + (i % 4) * 2, 0, 0, 0);
                    
                    return (
                      <button
                        key={i}
                        onClick={() => handleBookAppointment(selectedDoctor.user_id, date.toISOString())}
                        className="p-3 bg-teal-500/20 hover:bg-teal-500/30 rounded-lg text-sm transition-colors duration-200"
                        disabled={bookAppointmentMutation.isLoading}
                      >
                        <div className="font-medium">{date.toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Lifestyle Section Component
function LifestyleSection({ recommendations }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'diet', 'hydration', 'exercise'];
  
  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.recommendation_type === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="glassmorphism rounded-2xl p-6">
        <h3 className="text-2xl font-bold mb-6 neon-text">Lifestyle Recommendations</h3>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg capitalize transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Recommendations Grid */}
        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="mx-auto text-gray-400 mb-4" size={48} />
            <h4 className="text-lg font-semibold mb-2">No Recommendations Available</h4>
            <p className="text-gray-400">Complete your health assessment to get personalized recommendations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.map((recommendation) => (
              <div key={recommendation.id} className="bg-gray-800/50 rounded-lg overflow-hidden">
                {recommendation.video_thumbnail && (
                  <div className="relative">
                    <img
                      src={recommendation.video_thumbnail}
                      alt={recommendation.title}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors duration-200">
                      <Play className="text-white" size={48} />
                    </button>
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      recommendation.recommendation_type === 'diet' ? 'bg-green-500/20 text-green-400' :
                      recommendation.recommendation_type === 'hydration' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {recommendation.recommendation_type}
                    </span>
                    <span className="text-xs text-gray-400">Priority {recommendation.priority}</span>
                  </div>
                  
                  <h4 className="font-semibold mb-2">{recommendation.title}</h4>
                  <p className="text-sm text-gray-300 mb-4">{recommendation.description}</p>
                  
                  {recommendation.video_url && (
                    <button
                      onClick={() => window.open(recommendation.video_url, '_blank')}
                      className="w-full bg-teal-500/20 hover:bg-teal-500/30 py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                    >
                      Watch Video
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function for risk colors
function getRiskColor(risk) {
  switch (risk) {
    case 'high': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'low': return '#10b981';
    default: return '#6b7280';
  }
}