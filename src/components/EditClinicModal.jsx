import React, { Fragment, useState } from 'react';
import Adress from './Address';
import { toast } from 'react-toastify';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import logo from '../assets/petut.png';
import { BeatLoader } from 'react-spinners';
import { MdDelete } from 'react-icons/md';



export default function EditClinicModal({ clinic, modalId }) {
  const { name: defaultName, address: defaultAddress, phone: defaultPhone, email: defaultEmail, status: defaultStatus, price: defaultPrice, workingHours: defaultWorkingHours } = clinic;
  // const { day: defaultDay, openTime: defaultOpenTime, closeTime: defaultCloseTime } = defaultWorkingHours[0];
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState(defaultPhone);
  const [price, setPrice] = useState(defaultPrice);
  const [status, setStatus] = useState(defaultStatus);
  const [address, setAddress] = useState(defaultAddress || { governorate: '', city: '' });

  const [notEditable, setnotEditable] = useState(true);
  const [loading, setLoading] = useState(false);

  const [day, setDay] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [workingHours, setWorkingHours] = useState(defaultWorkingHours || []);




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



  //edit clinic 
  const handleSave = async () => {
    try {
      setLoading(true);
      const clinicRef = doc(db, 'clinics', modalId);
      await updateDoc(clinicRef, {
        name,
        phone,
        email,
        price,
        address,
        status,
        workingHours
      })
      toast.success('Clinic updated successfully', { autoClose: 3000 });
      setTimeout(() => {
        document.getElementById('close-btn-edit').click();
        window.location.reload();
      }, 3000);

    } catch (error) {
      toast.error("Failed to update clinic, error:" + error.message, { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const resetFields = () => {
    setName(defaultName);
    setEmail(defaultEmail);
    setPhone(defaultPhone);
    setStatus(defaultStatus);
    setPrice(defaultPrice);
    setAddress(defaultAddress);
    setWorkingHours(defaultWorkingHours);
  }
  return (
    <Fragment>
      <div className="modal fade" id={`editclinic-${modalId}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-between">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Clinic Info</h1>
              <img src={logo} width={'90px'} height={'90px'} alt="logo" />
            </div>
            <div className="modal-body">
              <form action="#">
                {/* Clinic Info */}
                <div className="clinic-name d-flex align-items-center gap-3 mb-3">
                  <label className="form-label" htmlFor='clinic-name'>Clinic Name</label>
                  <input type="text" className="form-control w-75" id='clinic-name' placeholder='Enter Clinic Name' value={name} onChange={(e) => setName(e.target.value)} disabled={notEditable} />
                </div>


                <div className="clinic-phone d-flex align-items-center gap-3 mb-3">
                  <label className="form-label" htmlFor='clinic-phone'>Phone</label>
                  <input type="tel" className="form-control w-75" id='clinic-phone' placeholder='Enter Clinic Phone' value={phone} onChange={(e) => setPhone(e.target.value)} disabled={notEditable} />
                </div>

                <div className="clinic-email d-flex align-items-center gap-3 mb-3">
                  <label className="form-label" htmlFor='clinic-email'>Email</label>
                  <input type="email" className="form-control w-75" id='clinic-email' placeholder='Enter Clinic Email' value={email} onChange={(e) => setEmail(e.target.value)} disabled={notEditable} />
                </div>
                <div className="clinic-price d-flex align-items-center gap-3 mb-3">
                  <label className="form-label" htmlFor='clinic-price'>price</label>
                  <input type="number" className="form-control w-75" id='clinic-price' placeholder='Enter Cost' value={price} onChange={(e) => setPrice(e.target.value)} disabled={notEditable} />
                </div>
                <div className="status d-flex align-items-center gap-3 mb-3">
                  <p className='mb-0'>Choose Status</p>
                  <select name="status" id="status" className="form-select w-50" value={status} onChange={(e) => setStatus(e.target.value)} disabled={notEditable}>
                    <option value="">Choose Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <Adress onAddressChange={setAddress}  />
                <hr />

                <div className="appointment mb-3">
                  <p className='fw-bold mb-2'>Working Hours</p>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <select className="form-select w-auto" value={day} onChange={(e) => setDay(e.target.value)} disabled={notEditable}>
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
                    <input type="time" className="form-control w-auto" value={openTime} onChange={(e) => setOpenTime(e.target.value)} disabled={notEditable} />
                    <span>to</span>
                    <input type="time" className="form-control w-auto" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} disabled={notEditable} />
                    <button type="button" className="btn btn-success ms-2" onClick={handleAddDay} disabled={notEditable}>Add</button>
                  </div>

                  {workingHours.length > 0 && (
                    <ul className="mt-3  list-group w-75">
                      {workingHours.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center mb-2 border rounded px-3 py-2">
                          <span>{item.day}: {item.openTime} - {item.closeTime}</span>
                          <button className="btn border-0" onClick={() => handleDeleteDay(item.day)} disabled={notEditable}>
                            <MdDelete size={25} className='text-danger' />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </form>
            </div>



            {notEditable ? (

              <div className="modal-footer d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-danger" id='close-btn-edit' data-bs-dismiss="modal" style={{ width: '100px' }}>Close</button>
                <button type="button" className="custom-button" style={{ width: '100px' }} onClick={() => setnotEditable(false)}>Edit</button>
              </div>
            ) : (
              <div className="modal-footer d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-danger" id='close-btn-edit' data-bs-dismiss="modal" style={{ width: '100px' }} onClick={() => {

                  resetFields();
                  setnotEditable(true);
                }
                } >Cancel</button>
                <button type="button" className="custom-button" style={{ width: '100px' }} onClick={handleSave} disabled={notEditable || loading} >{loading ? <BeatLoader size={10} color="#fff" /> : "Edit Clinic"}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}
