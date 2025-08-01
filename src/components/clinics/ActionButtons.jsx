import React from "react";

const ActionButtons = ({ clinic }) => (
  <div className="flex gap-4 mt-8">
    <button className="flex-1 btn-secondary flex items-center justify-center gap-2 shadow-sm">
      <span className="material-icons text-primary_app">call</span> Call
    </button>
    <button
      className="flex-1 btn-primary-app flex items-center justify-center gap-2 shadow-md"
      onClick={() => {
        // Booking logic can go here
        alert("Booking functionality coming soon!");
      }}
    >
      <span className="material-icons text-white">event</span> Book Appointment
    </button>
  </div>
);

export default ActionButtons;
