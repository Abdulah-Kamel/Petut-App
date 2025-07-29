import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, addDoc, serverTimestamp, doc, updateDoc,} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import DarkModeToggle from "../components/DarkModeToggle";

const paymentMethods = [
  { key: "card", label: "💳 Visa / Mastercard" },
  { key: "cash", label: "💵 Cash on arrival" },
];

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { clinic, selectedDay, selectedTime, selectedDate } = state || {};
  const { currentUser } = useAuth();

  const [selectedPayment, setSelectedPayment] = useState("card");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!clinic || !selectedDay || !selectedTime || !selectedDate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 font-bold">Missing booking data.</div>
      </div>
    );
  }

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      // Prepare user info
      const userId = currentUser?.uid || "";
      const userName =
      currentUser?.displayName || currentUser?.email || "Unknown Customer";
      const customerEmail = currentUser?.email || "";
      const customerPhone = currentUser?.phoneNumber || ""; 
      // Add booking
 const docRef = await addDoc(collection(db, "bookings"), {
   clinicId: clinic.id,
   clinicName: clinic.clinicName || clinic.name || clinic.doctorName,
   clinicPhone: clinic.phone || clinic.phoneNumber,
   clinicLocation: clinic.clinicAddress || clinic.location,
   day: selectedDay,
   time: selectedTime,
   date: selectedDate,
   price: clinic.price,
   paymentMethod:
     selectedPayment === "card" ? "Visa / Mastercard" : "Cash on arrival",
   timestamp: serverTimestamp(),
   status: "booked",
   userId,
   userName,
   customerPhone,
   customerEmail,
   doctorId: clinic.id,
   doctorName: clinic.clinicName || clinic.name,
 });

      // booking Id
      await updateDoc(doc(db, "bookings", docRef.id), { bookingId: docRef.id });
      navigate("/booking-loading", {
        state: {
          clinic,
          selectedDay,
          selectedTime,
          selectedPayment:
            selectedPayment === "card"
              ? "Visa / Mastercard"
              : "Cash on arrival",
        },
      });
    } catch (e) {
      setLoading(false);
      alert("Booking failed: " + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-light dark:bg-gray-900 flex flex-col">
      <div className="bg-white dark:bg-gray-800 shadow p-4 flex items-center justify-center relative">
        <h2 className="font-bold text-lg dark:text-white">
          Confirm appointment
        </h2>
        <div className="absolute right-4">
          <DarkModeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Clinic Info */}
        <div className="flex items-center mb-6">
          <img
            src={clinic.image}
            alt={clinic.clinicName || clinic.name}
            className="w-20 h-20 rounded-full object-cover border dark:border-gray-600"
            onError={(e) => (e.target.style.display = "none")}
          />
          <div className="ml-4 flex-1">
            <div className="font-bold text-lg dark:text-white">
              {clinic.clinicName || clinic.name}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              {clinic.clinicAddress || clinic.location}
            </div>
            <div className="flex items-center mt-1">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="dark:text-white">
                {clinic.rating ? `${clinic.rating}/5` : "No rating"}
              </span>
            </div>
          </div>
        </div>

        {/* Appointment Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center mb-6">
          <span className="material-icons text-primary mr-3">event</span>
          <div>
            <div className="text-gray-500 dark:text-gray-400">
              Appointment time
            </div>
            <div className="font-bold dark:text-white">
              {selectedDay}, {selectedTime}
            </div>
          </div>
        </div>

        {/* Billing Details */}
        <div className="mb-6">
          <div className="font-bold mb-2 dark:text-white">Billing details</div>
          <InfoRow label="Consultation fee" value={`${clinic.price} EGP`} />
          <InfoRow label="Service fee & tax" value="FREE" />
          <InfoRow label="Total payable" value={`${clinic.price} EGP`} isBold />
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <span className="font-bold dark:text-white">Payment method</span>
            <button
              className="text-primary font-semibold"
              onClick={() => setShowPaymentModal(true)}
            >
              CHANGE
            </button>
          </div>
          <div className="mt-2 dark:text-white">
            {paymentMethods.find((m) => m.key === selectedPayment).label}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 flex items-center shadow">
        <div className="font-bold text-lg flex-1 dark:text-white">
          {clinic.price} EGP
        </div>
        <button
          className="btn-primary w-1/2"
          onClick={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm and pay"}
        </button>
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end z-50">
          <div className="bg-white dark:bg-gray-800 w-full rounded-t-2xl p-6">
            <div className="font-bold text-lg mb-4 dark:text-white">
              Select payment method
            </div>
            {paymentMethods.map((method) => (
              <label
                key={method.key}
                className="flex items-center py-2 cursor-pointer dark:text-white"
              >
                <input
                  type="radio"
                  className="mr-3"
                  checked={selectedPayment === method.key}
                  onChange={() => {
                    setSelectedPayment(method.key);
                    setShowPaymentModal(false);
                  }}
                />
                {method.label}
              </label>
            ))}
            <button
              className="mt-4 btn-secondary w-full dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              onClick={() => setShowPaymentModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function InfoRow({ label, value, isBold }) {
  return (
    <div className="flex justify-between py-1">
      <span className="dark:text-white">{label}</span>
      <span className={`${isBold ? "font-bold" : ""} dark:text-white`}>
        {value}
      </span>
    </div>
  );
}

export default BookingConfirmationPage;
