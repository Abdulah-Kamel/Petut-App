import React, { Fragment, useEffect, useState } from 'react';
import { MdDelete } from "react-icons/md";
import Address from './Address';
import { collection, addDoc, Timestamp, setDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import specializations from '../spcializations/spcializations.json';
import { db, auth } from '../firebase.js';
import logo from '../assets/petut.png';
import { BeatLoader } from 'react-spinners';
export default function AddClinicModal({ getClinics, loading, setLoading }) {
  const [day, setDay] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [workingHours, setWorkingHours] = useState([]);

  //Firebase data 
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [address, setAddress] = useState({ governorate: '', city: '' });

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);


  const [userData, setUserData] = useState(null);
  const [price, setPrice] = useState(null);


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
        toast.error("Failed to fetch doctors, error:" + error.message, { autoClose: 3000 });
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

  const handleDeleteDay = (dayDelated) => {
    setWorkingHours(workingHours.filter(item => item.day !== dayDelated));
  };

  const resetFields = () => {
    setName('');
    setPhone('');
    setEmail('');
    setAddress({ governorate: '', city: '' });
    setSelectedDoctor(null);
    setStatus('active');
    setWorkingHours([]);
    setPrice(null);
    setDay('');
    setOpenTime('');
    setCloseTime('');
    
  };

  // Add clinic data to Firebase
  const handleAddClinic = async () => {
    // Validate form fields
    if (!name.trim() || !phone.trim() || !email.trim() || !address.governorate || !address.city || workingHours.length === 0 || price === null || price === '' || !status) {
      toast.error('Please fill in all the required fields', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
      return
    }
    if (isAdmin && !selectedDoctor) {
      toast.error('Please select a doctor', { autoClose: 3000 });
      return;
    }
    try {
      setLoading(true);
      // Add clinic data to Firebase 
      const clinicData = {
        name,
        phone,
        email,
        address,
        workingHours,
        status,
        price,
        doctorId: isAdmin ? selectedDoctor?.id : auth.currentUser.uid,
        doctorName: isAdmin ? selectedDoctor?.fullName : userData?.fullName || '',
        createdAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, 'clinics'), clinicData);
      await setDoc(docRef, { ...clinicData, clinicId: docRef.id });
      await getClinics();
      toast.success('Clinic added successfully', { autoClose: 3000 });
      resetFields();

      setTimeout(() => {
        document.getElementById('close-btn-modal').click();
        getClinics();
      }, 3000);
    } catch (error) {
      toast.error("Failed to add clinic, error:" + error.message, { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Fragment>
      <div className="modal fade" id="addclinic" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-between py-0 pe-0">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Clinic Info</h1>
              <img src={logo} width={'90px'} height={'90px'} alt="logo" />
            </div>
            <div className="modal-body">
              <form action="#">
                {/* Clinic Info */}
                <div className="clinic-name d-flex align-items-center gap-3 mb-3">
                  <label className="form-label">Clinic Name</label>
                  <input type="text" className="form-control w-75" placeholder='Enter Clinic Name' value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="clinic-phone d-flex align-items-center gap-3 mb-3">
                  <label className="form-label">Phone</label>
                  <input type="tel" className="form-control w-75" placeholder='Enter Clinic Phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="clinic-email d-flex align-items-center gap-3 mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control w-75" placeholder='Enter Clinic Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="clinic-price d-flex align-items-center gap-3 mb-3">
                  <label className="form-label">Cost</label>
                  <input type="number" className="form-control w-75" placeholder='Enter Cost' value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>

                {isAdmin && (

                  <div className="mb-3 d-flex align-items-center gap-3">
                    <label htmlFor="doctor" className="form-label">Doctor</label>
                    <select
                      className="form-select w-50 text-dark"
                      id="doctor"
                      value={selectedDoctor ? `${selectedDoctor.id}|${selectedDoctor.name || selectedDoctor.fullName}` : ''}
                      onChange={(e) => {
                        const [id, fullName] = e.target.value.split('|');
                        setSelectedDoctor({ id, fullName });
                      }}
                      required
                    >
                      <option value="">Select a doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={`${doctor.id}|${doctor.fullName || doctor.name}`} color='red'>
                          {doctor.fullName || doctor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Address onAddressChange={setAddress} />

                <div className="status d-flex align-items-center gap-3">
                  <p className='mb-0'>Choose Status</p>
                  <select name="status" id="status" className="form-select w-50" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Choose Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <hr />
                <div className="appointment mb-3">
                  <p className='fw-bold mb-2'>Working Hours</p>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <select className="form-select w-auto" value={day} onChange={(e) => setDay(e.target.value)}>
                      <option value="">Select Day</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                    </select>
                    <span>from</span>
                    <input type="time" className="form-control w-auto" value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
                    <span>to</span>
                    <input type="time" className="form-control w-auto" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} />
                    <button type="button" className="btn btn-success ms-2" onClick={handleAddDay}>Add</button>
                  </div>

                  {workingHours.length > 0 && (
                    <ul className="mt-3  list-group w-75">
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

                {/* Status */}
                <div className="modal-footer d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-danger " id='close-btn-modal' data-bs-dismiss="modal" style={{ width: '100px' }}>Close</button>
                  <button type="button" className="custom-button" style={{ width: '100px' }} onClick={handleAddClinic} disabled={loading}> {loading ? <BeatLoader size={10} color='#fff' /> : 'Add Clinic'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </Fragment >
  )
}
