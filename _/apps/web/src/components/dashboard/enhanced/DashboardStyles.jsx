export default function DashboardStyles() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");
      
      .glassmorphism {
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(20, 184, 166, 0.3);
      }
      
      .neon-glow {
        box-shadow: 0 0 25px rgba(20, 184, 166, 0.4), 0 0 50px rgba(0, 0, 0, 0.8);
      }
      
      .neon-text {
        text-shadow: 0 0 15px rgba(20, 184, 166, 0.7), 0 0 30px rgba(0, 0, 0, 0.5);
      }
      
      .scan-animation {
        animation: scanPulse 2s infinite;
      }
      
      .kidney-3d {
        background: radial-gradient(circle at 30% 30%, #14b8a6, #000000);
        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        transform-style: preserve-3d;
        transition: transform 0.1s ease;
        border: 2px solid rgba(20, 184, 166, 0.5);
      }
      
      .rotate-3d {
        transform: perspective(200px) rotateX(15deg) rotateY(var(--rotate-y, 0deg));
      }
      
      .float-animation {
        animation: float 3s ease-in-out infinite;
      }
      
      .pulse-glow {
        animation: pulseGlow 2s ease-in-out infinite;
      }
      
      .scan-wave {
        animation: scanWave 2s ease-in-out infinite;
      }
      
      .teal-black-gradient {
        background: linear-gradient(135deg, #14b8a6 0%, #000000 100%);
      }
      
      .teal-black-border {
        border: 1px solid rgba(20, 184, 166, 0.4);
        background: rgba(0, 0, 0, 0.6);
      }
      
      @keyframes scanPulse {
        0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 20px rgba(20, 184, 166, 0.3); }
        50% { opacity: 0.8; transform: scale(1.05); box-shadow: 0 0 30px rgba(20, 184, 166, 0.6); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.8); }
        50% { box-shadow: 0 0 40px rgba(20, 184, 166, 0.8), inset 0 0 40px rgba(0, 0, 0, 0.9); }
      }
      
      @keyframes scanWave {
        0% { transform: translateX(-100%) scaleY(0.5); opacity: 0; }
        50% { transform: translateX(0%) scaleY(1); opacity: 1; }
        100% { transform: translateX(100%) scaleY(0.5); opacity: 0; }
      }
      
      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8px;
      }
      
      .time-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
      }
    `}</style>
  );
}
