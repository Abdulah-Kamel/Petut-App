import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const BookingSuccessPage = () => {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false);
  const iconRef = useRef(null);
  useEffect(() => {
    if (iconRef.current) {
      iconRef.current.animate(
        [
          { transform: "scale(0.5)", opacity: 0 },
          { transform: "scale(1.1)", opacity: 1 },
          { transform: "scale(1)", opacity: 1 },
        ],
        {
          duration: 800,
          fill: "forwards",
          easing: "cubic-bezier(.68,-0.55,.27,1.55)",
        }
      );
    }

    const textTimeout = setTimeout(() => setShowText(true), 500);
    const navTimeout = setTimeout(() => navigate("/", { replace: true }), 3000);
    return () => {
      clearTimeout(textTimeout);
      clearTimeout(navTimeout);
    };
  }, [navigate]);

  return (
    <div
      className="min-h-screen dark:bg-gray-900 flex flex-col"
      style={{ maxWidth: "375px", margin: "0 auto", position: "relative" }}
    >
     

      {/* Success Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Success Icon */}
        <div ref={iconRef} className="mb-16">
          <div
            className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            style={{
              opacity: 1,
              transition: "opacity 0.8s",
            }}
          >
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Text */}
        <div
          className={`transition-opacity duration-600 text-3xl font-bold text-gray-700 dark:text-white text-center mb-6 ${
            showText ? "opacity-100" : "opacity-0"
          }`}
        >
          Appointment Confirmed!
        </div>

        {/* Description Text */}
        <div
          className={`transition-opacity duration-800 text-lg text-gray-500 dark:text-gray-300 text-center leading-relaxed ${
            showText ? "opacity-100" : "opacity-0"
          }`}
        >
          Your appointment has been booked successfully.
          <br />
          <br />
          Returning to home...
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
