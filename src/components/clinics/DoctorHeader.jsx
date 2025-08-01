import React from "react";

const DoctorHeader = ({ clinic }) => {
  const rating = clinic.rating || 0;
  return (
    <div className="flex flex-col items-center mb-4">
      <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg border-4 border-white bg-secondary-light">
        {clinic.profileImage ? (
          <img
            src={clinic.profileImage}
            alt="Doctor"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="material-icons text-6xl text-primary_app flex items-center justify-center w-full h-full">
            person
          </span>
        )}
      </div>
      <div className="font-bold text-xl text-primary_app mt-2">
        {clinic.doctorName}
      </div>
      <div className="text-secondary text-sm">
        Specialty: {clinic.specialty || "Unknown"}
      </div>
      <div className="flex items-center gap-2 text-secondary mt-1 text-sm">
        <span>{rating.toFixed(1)}</span>
        <span className="material-icons text-primary_app text-base">star</span>
        <span>|</span>
        <span>{clinic.phone || "No phone"}</span>
      </div>
      <div className="text-secondary text-sm">
        Experience: {clinic.experience || "-"} years
      </div>
    </div>
  );
};

export default DoctorHeader;
