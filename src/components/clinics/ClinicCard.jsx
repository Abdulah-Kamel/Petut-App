import React from "react";
const ClinicCard = ({ clinic, onClick, userLocation }) => {
  const rating = clinic.rating || 0;
  const doctorName = clinic.doctorName || "No Doctor Assigned";
  const isValidDoctor = clinic.isValidDoctor !== false;
  const distanceText = clinic.formattedDistance || "Distance unknown";
  const hasDistance = clinic.distance !== null && clinic.distance !== undefined;

  let displayAddress = "Unknown Address";
  if (clinic.address && typeof clinic.address === "string") {
    displayAddress = clinic.address;
  } else if (
    clinic.address &&
    typeof clinic.address === "object" &&
    clinic.address.city &&
    clinic.address.governorate
  ) {
    displayAddress = `${clinic.address.city}, ${clinic.address.governorate}`;
  }

  return (
    <div
      className="card p-6 flex gap-6 items-center cursor-pointer hover:shadow-2xl transition min-h-[130px]"
      onClick={onClick}
    >
      <div className="w-20 h-20 rounded-xl bg-secondary-light flex items-center justify-center overflow-hidden flex-shrink-0">
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

      <div className="flex-1 min-w-0">
        <div className="font-bold text-xl text-primary mb-2 truncate">
          {clinic.clinicName || clinic.name || "Unknown Clinic Name"}
        </div>

        <div className="text-base text-secondary mb-2 flex items-center gap-2">
          <span className="material-icons text-gray-400 text-lg">place</span>
          <p className="truncate">{displayAddress}</p>
        </div>

        {isValidDoctor &&
          doctorName &&
          ![
            "No Doctor Assigned",
            "Not a Doctor",
            "Doctor Not Found",
            "Error Loading Doctor",
          ].includes(doctorName) && (
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons text-primary text-lg">
                verified
              </span>
              <span className="text-base text-neutral truncate">
                Dr. {doctorName}
              </span>
            </div>
          )}

        {!isValidDoctor && (
          <div className="flex items-center gap-2 mb-2">
            <span className="material-icons text-orange-500 text-lg">
              warning
            </span>
            <span className="text-sm text-orange-600 truncate">
              {doctorName}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`material-icons ${
                  i < rating ? "text-primary" : "text-secondary-light"
                } text-lg`}
              >
                star
              </span>
            ))}
          </div>

          {hasDistance && (
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                clinic.distance <= 5
                  ? "bg-green-100 dark:bg-green-900/30"
                  : clinic.distance <= 15
                  ? "bg-blue-100 dark:bg-blue-900/30"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <span
                className={`material-icons text-sm ${
                  clinic.distance <= 5
                    ? "text-green-600 dark:text-green-400"
                    : clinic.distance <= 15
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                near_me
              </span>
              <span
                className={`text-sm font-semibold ${
                  clinic.distance <= 5
                    ? "text-green-700 dark:text-green-300"
                    : clinic.distance <= 15
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {distanceText}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {clinic.price && (
              <div className="flex items-center gap-1">
                <span className="material-icons text-xs">attach_money</span>
                <span>{clinic.price}</span>
              </div>
            )}
          </div>

          {!hasDistance && userLocation && (
            <span className="text-xs text-gray-400 italic">
              Location data unavailable
            </span>
          )}
        </div>
      </div>

      <span className="material-icons text-secondary text-2xl flex-shrink-0">
        arrow_forward_ios
      </span>
    </div>
  );
};

export default ClinicCard;
