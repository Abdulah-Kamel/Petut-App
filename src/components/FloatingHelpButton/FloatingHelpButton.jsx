import React, { useState } from 'react';
import { MessageCircle, X, } from 'lucide-react';
const FloatingHelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHelp = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleHelp}
        />
      )}
      {isOpen && (
        <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-xl p-6 max-w-sm w-80 z-50 transform transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Help Center</h3>
            <button
              onClick={toggleHelp}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => (window.location.href = "/identify")}
              className="w-full bg-primary_app hover:bg-primary_app/90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🧠 AI Breed Identifier
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-50">
      
        <div className="absolute inset-0 rounded-full bg-primary_app opacity-50 animate-ping"></div>
        <div className="absolute inset-0 rounded-full bg-primary_app opacity-25 animate-pulse"></div>

        <button
          onClick={toggleHelp}
          className={`relative bg-primary_app hover:bg-primary_app/90 text-white p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{
            boxShadow:
              "0 0 30px rgba(249, 115, 22, 0.6), 0 0 60px rgba(249, 115, 22, 0.4)",
            animation: "glow 2s ease-in-out infinite alternate",
          }}
          aria-label="مركز المساعدة"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      <style>
        {`
        @keyframes glow {
          from {
            box-shadow: 0 0 10px rgba(249, 115, 22, 0.2),
              0 0 15px rgba(249, 115, 22, 0.1),
              0 0 20px rgba(249, 115, 22, 0.05);
          }
          to {
            box-shadow: 0 0 20px rgba(249, 115, 22, 0.4),
              0 0 30px rgba(249, 115, 22, 0.2), 0 0 40px rgba(249, 115, 22, 0.1);
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
      `}
      </style>
    </>
  );
};

export default FloatingHelpButton;
