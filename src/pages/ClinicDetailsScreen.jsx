import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const ClinicDetailsScreen = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const clinic = state?.clinic;

  // Date and time selection
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!clinic) {
    return (
      <div className="p-8 text-center text-neutral">No clinic data found.</div>
    );
  }

  const rating = clinic.rating || 0;
  const reviews = clinic.reviews || [
    {
      name: "Ahmed M.",
      text: "Very professional doctor, listened carefully and explained everything.",
    },
    {
      name: "Sara A.",
      text: "The clinic was clean and the staff was helpful.",
    },
  ];

  const checkBookingAvailability = async () => {
    setError("");
    setLoading(true);
    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(
        bookingsRef,
        where("clinicId", "==", clinic.id),
        where(
          "date",
          "==",
          selectedDateTime ? selectedDateTime.toDateString() : ""
        ),
        where(
          "time",
          "==",
          selectedDateTime
            ? selectedDateTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""
        )
      );
      const snapshot = await getDocs(q);
      setLoading(false);
      return snapshot.empty;
    } catch (e) {
      setLoading(false);
      setError("An error occurred while checking slot availability.");
      return false;
    }
  };

  const handleBook = async () => {
    if (!selectedDateTime) {
      setError("Please select date and time.");
      return;
    }
    const available = await checkBookingAvailability();
    if (!available) {
      setError("This slot is not available. Please choose another time.");
      return;
    }
    // Proceed to booking confirmation
    navigate("/booking-confirmation", {
      state: {
        clinic,
        selectedDay: selectedDateTime.toDateString(),
        selectedTime: selectedDateTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        selectedDate: selectedDateTime,
      },
    });
  };

  return (
    <div className="min-h-screen bg-secondary-light dark:bg-gray-900 pb-8 font-sans">
      <div className="max-w-xl mx-auto px-4 pt-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="text-2xl text-secondary hover:text-primary dark:text-gray-300 dark:hover:text-primary"
          >
            <span className="material-icons">arrow_back</span>
          </button>
          <h1 className="text-2xl font-bold text-primary dark:text-white flex-1">
            {clinic.clinicName || clinic.doctorName}
          </h1>
          <DarkModeToggle />
        </div>

        {/* Doctor profile card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center gap-6 border border-gray-100 dark:border-gray-700 mb-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-gray-700 bg-secondary-light dark:bg-gray-600 flex items-center justify-center">
            {clinic.profileImage ? (
              <img
                src={clinic.profileImage}
                alt="Doctor"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-icons text-6xl text-primary flex items-center justify-center w-full h-full">
                person
              </span>
            )}
          </div>
          <div className="ml-6 flex-1">
            <div className="font-bold text-lg md:text-xl text-primary dark:text-white mb-1">
              {clinic.clinicName || clinic.doctorName}
            </div>
            <div className="text-black dark:text-gray-300 text-sm mb-1">
              Specialty: {clinic.specialty || "Unknown"}
            </div>
            <div className="flex items-center gap-2 text-black dark:text-gray-300 text-sm mb-1">
              <span>{rating.toFixed(1)}</span>
              <span className="material-icons text-primary text-base">
                star
              </span>
              <span>|</span>
              <span>{clinic.phone || clinic.phoneNumber || "No phone"}</span>
            </div>
            <div className="text-black dark:text-gray-300 text-sm">
              Experience: {clinic.experience || "-"} years
            </div>
          </div>
        </div>

        {/* Info Rows */}
        <div className="space-y-2 text-sm text-neutral dark:text-gray-300 mb-6">
          <div className="flex items-center gap-2">
            <span className="material-icons text-primary">location_on</span>
            <span>
              {clinic.clinicAddress || clinic.location || "Any location"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-icons text-primary">attach_money</span>
            <span>{clinic.price ? `${clinic.price} EGP` : "0.0 EGP"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-icons text-primary">schedule</span>
            <span>{clinic.isOpen ? "Open Now" : "Closed"}</span>
          </div>
        </div>

        {/* Date & Time Picker card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700 mb-6">
          <div className="font-semibold text-primary dark:text-white mb-2 text-sm">
            Select Date & Time
          </div>
          <DatePicker
            selected={selectedDateTime}
            onChange={(date) => setSelectedDateTime(date)}
            minDate={new Date()}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="yyyy-MM-dd h:mm aa"
            className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholderText="Choose date and time"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-600 dark:text-red-400 font-semibold text-center">
            {error}
          </div>
        )}

        {/* Patient Reviews card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700 mb-6">
          <div className="font-semibold text-primary dark:text-white mb-2 text-sm">
            Patient Reviews
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm">
            {reviews.map((r, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="font-bold text-primary dark:text-white">
                  {r.name}
                </div>
                <div className="text-neutral dark:text-gray-300 text-sm">
                  {r.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            className="flex-1 btn-secondary flex items-center justify-center gap-2 shadow-sm dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            onClick={() => {
              window.open(`tel:${clinic.phone || clinic.phoneNumber || ""}`);
            }}
          >
            <span className="material-icons text-primary">call</span> Call
          </button>
          <button
            className="flex-1 btn-primary flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
            disabled={!selectedDateTime || loading}
            onClick={handleBook}
          >
            <span className="material-icons text-white">event</span> Book
            Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicDetailsScreen;
