import React from "react";

const Reviews = ({ reviews }) => (
  <div className="mt-6">
    <div className="font-semibold text-primary_app mb-2 text-sm">
      Patient Reviews
    </div>
    <div className="bg-white rounded-xl p-4 shadow-sm">
      {reviews.map((r, i) => (
        <div key={i} className="mb-4">
          <div className="font-bold text-primary_app">{r.name}</div>
          <div className="text-neutral text-sm">{r.text}</div>
        </div>
      ))}
    </div>
  </div>
);

export default Reviews;
