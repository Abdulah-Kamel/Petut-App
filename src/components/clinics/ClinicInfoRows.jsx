import React from "react";

const ClinicInfoRows = ({ clinic }) => (
  <div className="space-y-2 text-sm text-neutral">
    <div className="flex items-center gap-2">
      <span className="material-icons text-primary_app">location_on</span>
      <span>{clinic.clinicAddress || "any location"}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="material-icons text-primary_app">attach_money</span>
      <span>{clinic.price ? `${clinic.price} EGP` : "0.0 EGP"}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="material-icons text-primary_app">schedule</span>
      <span>{clinic.isOpen ? "Open" : "Closed"}</span>
    </div>
  </div>
);

export default ClinicInfoRows;
