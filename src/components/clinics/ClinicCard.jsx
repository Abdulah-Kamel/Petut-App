import React from "react";

const ClinicCard = ({ clinic, onClick }) => {
  const rating = clinic.rating || 0;
  return (
    <div
      className="card p-6 flex gap-6 items-center cursor-pointer hover:shadow-2xl transition min-h-[110px]"
      onClick={onClick}
    >
      <div className="w-20 h-20 rounded-xl bg-secondary-light flex items-center justify-center overflow-hidden">
        {clinic.profileImage ? (
          <img
            src={clinic.profileImage}
            alt="Clinic"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="material-icons text-primary text-4xl">
            local_hospital
          </span>
        )}
      </div>
      <div className="flex-1">
        <div className="font-bold text-xl text-primary mb-1">
          {clinic.clinicName || "Unknown Name"}
        </div>
        <div className="text-base text-secondary mb-1">
          {clinic.clinicAddress || "Unknown Address"}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="material-icons text-primary text-lg">verified</span>
          <span className="text-base text-neutral">
            Dr. {clinic.doctorName || "---"}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`material-icons ${
                i < rating ? "text-primary" : "text-secondary-light"
              } text-xl`}
            >
              star
            </span>
          ))}
        </div>
      </div>
      <span className="material-icons text-secondary text-2xl">
        arrow_forward_ios
      </span>
    </div>
  );
};

export default ClinicCard;
