import { useState } from "react";
import useAuth from "@/utils/useAuth";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0F2027] flex items-center justify-center p-4">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .glassmorphism {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(20, 184, 166, 0.3);
        }
        
        .neon-glow {
          box-shadow: 0 0 25px rgba(20, 184, 166, 0.4), 0 0 50px rgba(0, 0, 0, 0.8);
        }
        
        .neon-text {
          text-shadow: 0 0 15px rgba(20, 184, 166, 0.7), 0 0 30px rgba(0, 0, 0, 0.5);
        }
      `}</style>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 mb-4 neon-glow">
            <div className="w-8 h-8 bg-white/20 rounded-full"></div>
          </div>
          <h1 className="text-3xl font-bold text-white neon-text">CalcifyX</h1>
          <p className="text-teal-300 text-sm mt-2">
            Smarter Kidney Care with AI
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="glassmorphism rounded-2xl p-8 space-y-6"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-300">Sign in to your CalcifyX account</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-teal-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-teal-500/30 rounded-lg text-white placeholder-gray-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-teal-500/30 rounded-lg text-white placeholder-gray-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 neon-glow"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="text-center">
            <p className="text-gray-300">
              Don't have an account?{" "}
              <a
                href="/account/signup"
                className="text-teal-400 hover:text-teal-300 font-medium transition-colors duration-200"
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
