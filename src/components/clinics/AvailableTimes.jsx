import React from "react";

const AvailableTimes = ({ availableTimes }) => (
  <div className="mt-4">
    <div className="font-semibold text-primary_app mb-2 text-sm">
      Available Times
    </div>
    <div className="flex flex-wrap gap-2">
      {availableTimes.map((time) => (
        <span
          key={time}
          className="px-4 py-1 border border-primary rounded-full bg-white text-primary_app text-sm shadow-sm"
        >
          {time}
        </span>
      ))}
    </div>
  </div>
);

export default AvailableTimes;
