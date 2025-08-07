import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import LoadingAnimation from '../common/LoadingAnimation.jsx';
import { useNavigate } from 'react-router-dom';

const ReservationsTab = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const reservationsRef = collection(db, 'bookings');
        const q = query(
          reservationsRef,
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const userReservations = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort reservations by date in descending order
        userReservations.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        setReservations(userReservations);
      } catch (err) {
        setError('Failed to fetch reservations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [currentUser]);

  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white dark:bg-[#313340] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-2xl dark:text-white font-bold mb-6">My Clinic Reservations</h2>
      {reservations.length === 0 ? (
        <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          <h3 className="text-xl dark:text-white font-semibold mb-2">No reservations yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You haven't booked any clinic appointments.
          </p>
          <button
            onClick={() => navigate("/clinics")}
            className="px-6 py-3 bg-primary_app text-white font-semibold rounded-lg hover:bg-primary_app/90 transition-colors"
          >
            Book a Visit
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map(reservation => (
            <div key={reservation.id} className="border border-gray-200 dark:border-gray-500 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-secondary-dark p-4 flex flex-wrap max-md:flex-col max-md:items-start justify-between items-center">
                    <div>
                        <span className="text-sm text-gray-600 dark:text-white">Date:</span>
                        <span className="ml-2 dark:text-gray-400">
                            {reservation.createdAt ? new Date(reservation.createdAt.seconds * 1000).toLocaleDateString() : "-"}
                        </span>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600 dark:text-white">Status:</span>
                        <span
                            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reservation.status === 'booked' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {reservation.status}
                        </span>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600 dark:text-white">Total:</span>
                        <span className="ml-2 font-semibold dark:text-white">
                            {reservation.price?.toFixed(2) || "0.00"} $
                        </span>
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="font-semibold mb-3 dark:text-white">Booking Details</h3>
                    <div className="flex justify-between items-center">
                        <div className='space-y-2'>
                            <p className="font-medium dark:text-white">{reservation.clinicName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Doctor: {reservation.doctorName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Time: {reservation.time}</p>
                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationsTab;
