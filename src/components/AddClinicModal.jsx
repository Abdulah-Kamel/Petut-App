import { Fragment, useEffect, useRef, useState } from 'react';
import { MdDelete } from "react-icons/md";
import { collection, addDoc, Timestamp, setDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';

import 'leaflet/dist/leaflet.css';
import { db, auth } from '../firebase.js';
import logo from '../assets/petut.png';
import { BeatLoader } from 'react-spinners';
import { IoLocation } from "react-icons/io5";

// استدعاء مكون الخريطة الجديد
import MapModal from './MapModal.jsx';

export default function AddClinicModal({ fetchClinics, loading, setLoading }) {
    // حالة المودال والبيانات
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [price, setPrice] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [day, setDay] = useState('');
    const [openTime, setOpenTime] = useState('');
    const [closeTime, setCloseTime] = useState('');
    const [workingHours, setWorkingHours] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [userData, setUserData] = useState(null);
    // حالة ظهور مودال الخريطة
    const [showMapModal, setShowMapModal] = useState(false);

    const navigate = useNavigate();
    const isAdmin = userData?.role === 'admin';
    const location = useLocation();

    const modalRef = useRef(null);
    const [modalInstance, setModalInstance] = useState(null);

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
    }, []);

    useEffect(() => {
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

    // ... (باقي الدوال)
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

    const resetFields = () => {
        setName('');
        setPhone('');
        setEmail('');
        setStatus('');
        setWorkingHours([]);
        setPrice('');
        setDay('');
        setOpenTime('');
        setCloseTime('');
        setSelectedDoctor(null);
        setSelectedLocation('');
    };

    const handleAddClinic = async () => {
        setLoading(true);
        if (isAdmin && !selectedDoctor) {
            toast.error('Please select a doctor', { autoClose: 3000 });
            return;
        }

        try {
            const clinicData = {
                name,
                phone,
                email,
                workingHours,
                status,
                price,
                address: `${selectedLocation?.governorate || ''} - ${selectedLocation?.city || ''} - ${selectedLocation?.street || ''}`,
                city: selectedLocation?.city,
                governorate: selectedLocation?.governorate,
                latitude: selectedLocation?.latitude,
                longitude: selectedLocation?.longitude,
                street: selectedLocation?.street,
                doctorId: isAdmin ? selectedDoctor?.id : auth.currentUser.uid,
                doctorName: isAdmin ? selectedDoctor?.fullName : userData?.fullName || '',
                createdAt: Timestamp.now(),
            };

            const docRef = await addDoc(collection(db, 'clinics'), clinicData);
            await setDoc(docRef, { ...clinicData, clinicId: docRef.id });
            await fetchClinics();
            toast.success('Clinic added successfully', { autoClose: 3000 });
            resetFields();

            if (modalInstance) {
                modalInstance.hide();
            }
            fetchClinics();

        } catch (error) {
            toast.error("Failed to add clinic: " + error.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    // دالة لفتح مودال الخريطة وإخفاء المودال الحالي
    const handleOpenMapModal = () => {
        // نستخدم النسخة المخزنة لإخفاء المودال
        if (modalInstance) {
            modalInstance.hide();
        }
        setShowMapModal(true);
    };

    // دالة لاستقبال الموقع من مودال الخريطة
    const handleLocationConfirmed = (location) => {
        setSelectedLocation(location);
        setShowMapModal(false);
        // نستخدم النسخة المخزنة لإظهار المودال
        if (modalInstance) {
            modalInstance.show();
        }
    };

    // دالة لإغلاق مودال الخريطة دون تغيير الموقع
    const handleCloseMapModal = () => {
        setShowMapModal(false);
        // نستخدم النسخة المخزنة لإظهار المودال
        if (modalInstance) {
            modalInstance.show();
        }
    };

    useEffect(() => {
        // هذا الكود سيعمل مرة واحدة فقط عند تحميل المكون
        if (modalRef.current && window.bootstrap) {
            // ننشئ نسخة جديدة من مودال Bootstrap
            const modal = new window.bootstrap.Modal(modalRef.current, {
                keyboard: false,
                backdrop: 'static'
            });
            // نخزنها في حالة المكون
            setModalInstance(modal);
        }
    }, []);
    return (
        <Fragment>
            {/* هذا هو المودال الرئيسي الذي يحتوي على النموذج */}
            <div className="modal fade" id="addclinic" ref={modalRef} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between py-0 pe-0">
                            <h1 className="modal-title fs-5">Clinic Info</h1>
                            <img src={logo} width="90px" height="90px" alt="logo" />
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="clinic-name d-flex align-items-center gap-3 mb-3">
                                    <label className="form-label">Clinic Name</label>
                                    <input type="text" className="form-control w-75" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="clinic-phone d-flex align-items-center gap-3 mb-3">
                                    <label className="form-label">Phone</label>
                                    <input type="tel" className="form-control w-75" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                                <div className="clinic-email d-flex align-items-center gap-3 mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control w-75" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="clinic-price d-flex align-items-center gap-3 mb-3">
                                    <label className="form-label">Cost</label>
                                    <input type="number" className="form-control w-75" value={price} onChange={(e) => setPrice(e.target.value)} />
                                </div>

                                {isAdmin && (
                                    <div className="mb-3 d-flex align-items-center gap-3">
                                        <label className="form-label">Doctor</label>
                                        <select
                                            className="form-select w-50"
                                            value={selectedDoctor ? `${selectedDoctor.id}|${selectedDoctor.fullName}` : ''}
                                            onChange={(e) => {
                                                const [id, fullName] = e.target.value.split('|');
                                                setSelectedDoctor({ id, fullName });
                                            }}
                                        >
                                            <option value="">Select a doctor</option>
                                            {doctors.map((doctor) => (
                                                <option key={doctor.id} value={`${doctor.id}|${doctor.fullName}`}>{doctor.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="status d-flex align-items-center gap-3 mb-3">
                                    <p className='mb-0'>Choose Status</p>
                                    <select className="form-select w-50" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="">Choose Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                {/* هذا هو الزر الذي سيفتح مودال الخريطة */}
                                <div className="address d-flex align-items-center gap-3 mb-3">
                                    <p className='mb-0'>Choose Location</p>
                                    <button onClick={handleOpenMapModal} className='custom-button d-flex align-items-center gap-2' type='button' data-bs-toggle="modal" data-bs-target="#map-modal">
                                        <IoLocation /> choose location
                                    </button>
                                </div>
                                {selectedLocation && (
                                    <p className="mb-0">{selectedLocation.governorate} - {selectedLocation.city} - {selectedLocation.street}</p>
                                )}

                                <hr />
                                <div className="appointment mb-3">
                                    <p className='fw-bold mb-2'>Working Hours</p>
                                    <div className="d-flex align-items-center gap-3 flex-wrap">
                                        <select className="form-select w-auto" value={day} onChange={(e) => setDay(e.target.value)}>
                                            <option value="">Select Day</option>
                                            {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                        <span>from</span>
                                        <input type="time" className="form-control w-auto" value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
                                        <span>to</span>
                                        <input type="time" className="form-control w-auto" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} />
                                        <button type="button" className="btn btn-success ms-2" onClick={handleAddDay}>Add</button>
                                    </div>

                                    {workingHours.length > 0 && (
                                        <ul className="mt-3 list-group w-75">
                                            {workingHours.map((item, index) => (
                                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center mb-2 border rounded px-3 py-2">
                                                    <span>{item.day}: {item.openTime} - {item.closeTime}</span>
                                                    <button className="btn border-0" onClick={() => handleDeleteDay(item.day)}>
                                                        <MdDelete size={25} className='text-danger' />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="modal-footer d-flex justify-content-end gap-2">
                                    <button type="button" className="btn btn-danger" id="close-btn-modal" data-bs-dismiss="modal" style={{ width: '100px' }}>Close</button>
                                    <button type="button" className="custom-button" style={{ width: '100px' }} onClick={handleAddClinic} disabled={loading}>
                                        {loading ? <BeatLoader size={10} color='#fff' /> : 'Add Clinic'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* هذا هو المودال الجديد الذي سيحتوي على الخريطة */}
            {showMapModal && (
                <MapModal
                    onLocationConfirmed={handleLocationConfirmed}
                    onClose={handleCloseMapModal}
                    initialLocation={selectedLocation}
                />
            )}
        </Fragment>
    );
}