import React from "react";
import ClinicCard from "./ClinicCard";

const ClinicsList = ({ clinics, onClinicClick }) => {
  if (!Array.isArray(clinics) || clinics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <img
          src="/no-data.svg"
          alt="No data"
          className="w-40 mb-4 opacity-70"
        />
        <div className="text-lg text-secondary">There is no data yet</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      {clinics.map((clinic) => (
        <ClinicCard
          key={clinic.id || clinic.clinicId}
          clinic={clinic}
          onClick={() => onClinicClick(clinic)}
        />
      ))}
    </div>
  );
};

export default ClinicsList;
