import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0F2027] flex items-center justify-center p-4">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
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
      `}</style>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 mb-4 neon-glow">
            <div className="w-8 h-8 bg-white/20 rounded-full"></div>
          </div>
          <h1 className="text-3xl font-bold text-white neon-text">CalcifyX</h1>
          <p className="text-teal-300 text-sm mt-2">Smarter Kidney Care with AI</p>
        </div>

        <div className="glassmorphism rounded-2xl p-8 text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Sign Out</h2>
            <p className="text-gray-300">Are you sure you want to sign out of your CalcifyX account?</p>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400/20 transition-all duration-200 neon-glow"
          >
            Sign Out
          </button>

          <div className="text-center">
            <a
              href="/dashboard"
              className="text-teal-400 hover:text-teal-300 font-medium transition-colors duration-200"
            >
              Cancel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}