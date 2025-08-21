"use client";

import React, { useEffect, useRef } from "react";
import Button from "@/components/atoms/Button";
// Confetti effect (canvas-confetti)
import confetti from "canvas-confetti";

export default function CoolPage() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animation
    if (mainRef.current) {
      mainRef.current.classList.add("animate-fade-in");
    }
    // Confetti burst on load
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#a78bfa", "#f472b6", "#38bdf8", "#facc15"],
    });
  }, []);

  // Button confetti
  const handleConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#6366f1", "#a78bfa", "#f472b6", "#38bdf8", "#facc15"],
    });
    window.history.back();
  };

  return (
    <div className="min-h-screen py-16 animated-gradient-bg">
      <style>{`
        .animated-gradient-bg {
          background: linear-gradient(270deg, #a78bfa, #38bdf8, #f472b6, #facc15, #6366f1);
          background-size: 1200% 1200%;
          animation: gradientMove 18s ease infinite;
        }
        @keyframes gradientMove {
          0% {background-position:0% 50%}
          50% {background-position:100% 50%}
          100% {background-position:0% 50%}
        }
        .animate-fade-in {
          animation: fadeIn 1.2s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .neon-text {
          text-shadow: 0 0 8px #a78bfa, 0 0 16px #6366f1;
        }
        .glow-btn {
          box-shadow: 0 0 12px #38bdf8, 0 0 24px #a78bfa;
          transition: box-shadow 0.2s;
        }
        .glow-btn:hover {
          box-shadow: 0 0 24px #f472b6, 0 0 48px #facc15;
        }
      `}</style>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div ref={mainRef} className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce">
              <span className="text-3xl text-white">🚀</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 neon-text">
              Something Cool About Me
            </h1>
            <p className="text-xl text-gray-600 animate-fade-in">
              I&apos;m passionate about building solutions that make a real impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl animate-fade-in">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">🎯 Problem Solver</h3>
              <p className="text-blue-700">
                I love tackling complex challenges and finding elegant solutions that balance functionality, 
                performance, and user experience.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl animate-fade-in">
              <h3 className="text-xl font-semibold text-purple-800 mb-3">🌱 Continuous Learner</h3>
              <p className="text-purple-700">
                Always excited to explore new technologies and approaches. Every project is an opportunity 
                to grow and improve my skills.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 animate-fade-in">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">💡 Why I&apos;m Excited About This Project</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Building an admin portal for Crisis Corner is exactly the kind of meaningful work that drives me. 
              Creating tools that help organizations manage critical resources during natural disasters combines 
              technical excellence with real-world impact. I&apos;m excited to demonstrate my full-stack capabilities 
              while contributing to a solution that could make a difference in people&apos;s lives.
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleConfetti}
              className="w-auto px-8 py-3 text-lg glow-btn"
            >
              🎉 ← Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
