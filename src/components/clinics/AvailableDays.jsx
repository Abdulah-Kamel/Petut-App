import React from "react";

const AvailableDays = ({ availableDays }) => (
  <div className="mt-6">
    <div className="font-semibold text-primary_app mb-2 text-sm">
      Available Days
    </div>
    <div className="flex flex-wrap gap-2">
      {availableDays.map((day) => (
        <span
          key={day}
          className="px-4 py-1 border border-primary rounded-full bg-white text-primary_app text-sm shadow-sm"
        >
          {day}
        </span>
      ))}
    </div>
  </div>
);

export default AvailableDays;
