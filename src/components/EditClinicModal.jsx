import React, { Fragment, useState, useEffect } from 'react';
import MapModal from './MapModal.jsx';
import { toast } from 'react-toastify';
import { doc, updateDoc, collection, query, where, getDocs, getDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase.js';
import logo from '../assets/petut.png';
import { BeatLoader } from 'react-spinners';
import { MdDelete } from 'react-icons/md';
import { IoLocation } from 'react-icons/io5';
import { onAuthStateChanged } from 'firebase/auth';

export default function EditClinicModal({ clinic, setClinics, modalId, fetchClinics }) {

    const { name: defaultName, phone: defaultPhone, email: defaultEmail, address: defaultAddress, status: defaultStatus, price: defaultPrice, doctorName: defaultDoctorName, workingHours: defaultWorkingHours } = clinic;

    const [name, setName] = useState(defaultName);
    const [email, setEmail] = useState(defaultEmail);
    const [phone, setPhone] = useState(defaultPhone);
    const [price, setPrice] = useState(defaultPrice || '');
    const [address, setAddress] = useState(defaultAddress);

    const [doctorName, setDoctorName] = useState(defaultDoctorName);
    const [status, setStatus] = useState(defaultStatus);
    const [notEditable, setNotEditable] = useState(true);
    const [day, setDay] = useState('');
    const [openTime, setOpenTime] = useState('');
    const [closeTime, setCloseTime] = useState('');
    const [workingHours, setWorkingHours] = useState(defaultWorkingHours || []);
    const [loading, setLoading] = useState(false);

    const [userData, setUserData] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(defaultDoctorName ? { id: clinic.doctorId, fullName: defaultDoctorName } : null);
    const [showMapModal, setShowMapModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState({
        governorate: clinic.governorate || '',
        city: clinic.city || '',
        street: clinic.street || '',
        latitude: clinic.latitude || null,
        longitude: clinic.longitude || null
    });

    const isAdmin = userData?.role === 'admin';

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            }
        };
        fetchUserData();

        const getDoctors = async () => {
            try {
                const q = query(collection(db, "users"), where("role", "==", "doctor"));
                const querySnapshot = await getDocs(q);
                const doctorsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setDoctors(doctorsData);
            } catch (error) {
                toast.error("Failed to fetch doctors: " + error.message, { autoClose: 3000 });
            }
        };
        if (isAdmin) {
            getDoctors();
        }
    }, [isAdmin]);

    const handleAddDay = () => {
        if (day && openTime && closeTime) {
            const exists = workingHours.some(item => item.day === day);
            if (!exists) {
                setWorkingHours([...workingHours, { day, openTime, closeTime }]);
                setDay('');
                setOpenTime('');
                setCloseTime('');
            }
        }
    };

    const handleDeleteDay = (dayDeleted) => {
        setWorkingHours(workingHours.filter(item => item.day !== dayDeleted));
    };

    // const handleSave = async () => {
    //     try {
    //         setLoading(true);
    //         if (!name || !phone || !email || !price || !status || workingHours.length === 0) {
    //             toast.error("Please fill all required fields and select a location.", { autoClose: 3000 });
    //             setLoading(false);
    //             return;
    //         }

    //         const clinicRef = doc(db, 'clinics', clinic.id);
    //         await updateDoc(clinicRef, {
    //             name,
    //             phone,
    //             email,
    //             price,
    //             status,
    //             workingHours,
    //             address: selectedLocation?.governorate || selectedLocation?.city || selectedLocation?.street
    //                 ? `${selectedLocation?.governorate || ''} - ${selectedLocation?.city || ''} - ${selectedLocation?.street || ''}`
    //                 : address,
    //             city: selectedLocation?.city,
    //             governorate: selectedLocation?.governorate,
    //             latitude: selectedLocation?.latitude,
    //             longitude: selectedLocation?.longitude,
    //             street: selectedLocation?.street,
    //             doctorId: isAdmin ? selectedDoctor?.id : auth.currentUser.uid,
    //             doctorName: isAdmin ? selectedDoctor?.fullName : userData?.fullName || '',
    //         });
    //         toast.success('Clinic updated successfully', { autoClose: 3000 });
    //         setNotEditable(true);
    //         const modalEl = document.getElementById(`editclinic-${modalId}`);
    //         if (modalEl) {
    //             modalEl.classList.remove('show');
    //             modalEl.style.display = 'none';
    //             document.body.classList.remove('modal-open');

    //             // إزالة أي backdrop موجود
    //             const backdrops = document.querySelectorAll('.modal-backdrop');
    //             backdrops.forEach((b) => b.remove());
    //             setClinics(prev => prev.map(c => (c.id === clinic.id ? { ...c, name, phone, email, price, status, workingHours, address } : c)));
    //         }

    //         fetchClinics();

    //     } catch (error) {
    //         toast.error("Failed to update clinic, error:" + error.message, { autoClose: 3000 });
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSave = async () => {
        setLoading(true);

        try {
            const currentUser = auth.currentUser;

            if (!currentUser && !isAdmin) {
                toast.error("User not logged in.");
                setLoading(false);
                return;
            }

            // بيانات لازمة
            if (!name || !phone || !email || !price || !status || workingHours.length === 0) {
                toast.error("Please fill all required fields and select a location.", { autoClose: 3000 });
                setLoading(false);
                return;
            }

            const doctorId = isAdmin ? selectedDoctor?.id : currentUser.uid;
            const doctorName = isAdmin ? selectedDoctor?.fullName : userData?.fullName || '';

            if (!doctorId) {
                toast.error("Doctor ID not defined.");
                setLoading(false);
                return;
            }

            const clinicRef = doc(db, 'clinics', clinic.id);
            await updateDoc(clinicRef, {
                name,
                phone,
                email,
                price,
                status,
                workingHours,
                address: selectedLocation?.governorate || selectedLocation?.city || selectedLocation?.street
                    ? `${selectedLocation?.governorate || ''} - ${selectedLocation?.city || ''} - ${selectedLocation?.street || ''}`
                    : address,
                city: selectedLocation?.city || '',
                governorate: selectedLocation?.governorate || '',
                latitude: selectedLocation?.latitude || null,
                longitude: selectedLocation?.longitude || null,
                street: selectedLocation?.street || '',
                doctorId,
                doctorName,
            });

            setNotEditable(true);
            if (setClinics) {
                setClinics(prev => prev.map(c => (c.id === clinic.id ? { ...c, name, phone, email, price, status, workingHours, address } : c)));
            }

            if (fetchClinics) fetchClinics();

            // إغلاق المودال
            const modalEl = document.getElementById(`editclinic-${modalId}`);
            if (modalEl) {
                modalEl.classList.remove('show');
                modalEl.style.display = 'none';
                document.body.classList.remove('modal-open');
                document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
            }

        } catch (error) {
            toast.error("Failed to update clinic, error:" + error.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData({ ...docSnap.data(), uid: user.uid });
                }
            } else {
                setUserData(null);
            }
        });
        return () => unsubscribe();
    }, []);



    const resetFields = () => {
        setName(defaultName);
        setEmail(defaultEmail);
        setPhone(defaultPhone);
        setStatus(defaultStatus);
        setPrice(defaultPrice || '');
        setDoctorName(defaultDoctorName);
        setSelectedDoctor(defaultDoctorName ? { id: clinic.doctorId, fullName: defaultDoctorName } : null);
        setWorkingHours(defaultWorkingHours);
        setNotEditable(true);
        setAddress(defaultAddress);
        setDay('');
        setOpenTime('');
        setCloseTime('');
    };

    const handleOpenMapModal = () => {
        setShowMapModal(true);
    };

    const handleLocationConfirmed = (location) => {
        setSelectedLocation(location);
        setShowMapModal(false);
    };

    const handleCloseMapModal = () => {
        setShowMapModal(false);
    };

    return (
        <Fragment>
            <div className="modal fade" id={`editclinic-${modalId}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className={`modal-content ${isDarkMode ? 'bg-dark-2 text-white' : ''}`}>
                        <div className="modal-header d-flex align-items-center justify-content-between border-bottom-0">
                            <h1 className="modal-title fs-5 ps-3" id="staticBackdropLabel">Edit Clinic Info</h1>
                            <img src={logo} width={'90px'} height={'90px'} alt="logo" />
                        </div>
                        <div className="modal-body">
                            <form action="#">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor={`name-${modalId}`} className="form-label">Name</label>
                                        <input type="text" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} id={`name-${modalId}`} value={name} onChange={(e) => setName(e.target.value)} disabled={notEditable} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor={`phone-${modalId}`} className="form-label">Phone</label>
                                        <input type="text" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} id={`phone-${modalId}`} value={phone} onChange={(e) => setPhone(e.target.value)} disabled={notEditable} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor={`email-${modalId}`} className="form-label">Email</label>
                                        <input type="email" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} id={`email-${modalId}`} value={email} onChange={(e) => setEmail(e.target.value)} disabled={notEditable} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor={`status-${modalId}`} className="form-label">Status</label>
                                        <select className={`form-select ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} id={`status-${modalId}`} value={status} onChange={(e) => setStatus(e.target.value)} disabled={notEditable}>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor={`price-${modalId}`} className="form-label">Price</label>
                                        <input type="number" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} id={`price-${modalId}`} value={price} onChange={(e) => setPrice(e.target.value)} disabled={notEditable} />
                                    </div>
                                    {isAdmin && (
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor={`doctor-${modalId}`} className="form-label">Doctor</label>
                                            <select
                                                className={`form-select ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`}
                                                id={`doctor-${modalId}`}
                                                value={selectedDoctor ? JSON.stringify(selectedDoctor) : ''}
                                                onChange={(e) => setSelectedDoctor(JSON.parse(e.target.value))}
                                                disabled={notEditable}
                                            >
                                                <option value="">Select Doctor</option>
                                                {doctors.map(doc => (
                                                    <option key={doc.id} value={JSON.stringify(doc)}>{doc.fullName}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <button type="button" className="btn btn-secondary d-flex align-items-center gap-2" onClick={handleOpenMapModal} disabled={notEditable}>
                                        <IoLocation />
                                        Select Location
                                    </button>
                                    {selectedLocation && (
                                        <div className={`location-display p-2 rounded ${isDarkMode ? 'bg-dark border' : 'bg-light'}`}>
                                            <p className={`mb-0 fw-bold ${isDarkMode ? 'text-white' : ''}`}>{selectedLocation.governorate}, {selectedLocation.city}</p>
                                            <p className={`mb-0 ${isDarkMode ? 'text-white-50' : 'text-muted'}`}>{selectedLocation.street}</p>
                                        </div>
                                    )}
                                </div>
                                <hr className={`${isDarkMode ? 'border-secondary' : ''}`} />
                                <div className="working-hours-section mt-3">
                                    <h5 className='fs-6'>Working Hours</h5>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <select className={`form-select ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} value={day} onChange={(e) => setDay(e.target.value)} disabled={notEditable}>
                                                <option value="">Select Day</option>
                                                <option value="Saturday">Saturday</option>
                                                <option value="Sunday">Sunday</option>
                                                <option value="Monday">Monday</option>
                                                <option value="Tuesday">Tuesday</option>
                                                <option value="Wednesday">Wednesday</option>
                                                <option value="Thursday">Thursday</option>
                                                <option value="Friday">Friday</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <input type="time" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} value={openTime} onChange={(e) => setOpenTime(e.target.value)} disabled={notEditable} />
                                        </div>
                                        <div className="col-md-3">
                                            <input type="time" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} value={closeTime} onChange={(e) => setCloseTime(e.target.value)} disabled={notEditable} />
                                        </div>
                                        <div className="col-md-2">
                                            <button type="button" className="btn btn-primary w-100" onClick={handleAddDay} disabled={notEditable}>Add</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="working-hours-display mt-3">
                                    <ul className="list-group">
                                        {workingHours.map((wh, index) => (
                                            <li key={index} className={`list-group-item d-flex justify-content-between align-items-center ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`}>
                                                <span>{wh.day}: {wh.openTime} - {wh.closeTime}</span>
                                                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDeleteDay(wh.day)} disabled={notEditable}><MdDelete /></button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer border-top-0">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetFields}>Close</button>
                            {notEditable ? (
                                <button type="button" className="btn btn-warning" onClick={() => setNotEditable(false)}>Edit</button>
                            ) : (
                                <button type="button" className="btn btn-primary" onClick={handleSave} disabled={loading}>
                                    {loading ? <BeatLoader color="#fff" size={8} /> : 'Save changes'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showMapModal && (
                <MapModal
                    onConfirm={handleLocationConfirmed}
                    onClose={handleCloseMapModal}
                    isDarkMode={isDarkMode}
                />
            )}
        </Fragment>
    );
}