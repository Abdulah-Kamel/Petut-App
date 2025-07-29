import React, { Fragment, useState } from 'react';
import Adress from './Address';
import { toast } from 'react-toastify';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
// import specializations from '../spcializations/spcializations.json';
import logo from '../assets/petut.png';
import { BeatLoader } from 'react-spinners';





export default function EditClinicModal({ clinic, modalId }) {
  const { name: defaultName, address: defaultAddress, phone: defaultPhone, email: defaultEmail, status: defaultStatus } = clinic;


  const [name, setName] = useState(defaultName);
  // const [specialization, setSpecialization] = useState(defaultSpec);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState(defaultPhone);
  const [status, setStatus] = useState(defaultStatus);
  const [address, setAddress] = useState(defaultAddress || { governorate: '', city: '' });

  const [noteditable, setNotEditable] = useState(true);
  const [loading, setLoading] = useState(false);





  //edit clinic 
  const handleSave = async () => {
    try {
      setLoading(true);
      const clinicRef = doc(db, 'clinics', modalId);
      await updateDoc(clinicRef, {
        name,
        address,
        phone,
        email,
        status,

      })
      toast.success('Clinic updated successfully', { autoClose: 3000 });
      setTimeout(() => {
        document.getElementById('close-btn-edit').click();
        window.location.reload();
      }, 3000);

    } catch (error) {
      toast.error("Failed to update clinic, error:" + error.message, { autoClose: 3000 });
    }finally{
      setLoading(false);
    }
  };

  const resetFields = () => {
    setName(defaultName);
    setEmail(defaultEmail);
    setPhone(defaultPhone);
    setStatus(defaultStatus);
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
                  <input type="text" className="form-control w-75" id='clinic-name' placeholder='Enter Clinic Name' value={name} onChange={(e) => setName(e.target.value)} disabled={noteditable} />
                </div>


                <div className="clinic-phone d-flex align-items-center gap-3 mb-3">
                  <label className="form-label" htmlFor='clinic-phone'>Phone</label>
                  <input type="tel" className="form-control w-75" id='clinic-phone' placeholder='Enter Clinic Phone' value={phone} onChange={(e) => setPhone(e.target.value)} disabled={noteditable} />
                </div>

                <div className="clinic-email d-flex align-items-center gap-3 mb-3">
                  <label className="form-label" htmlFor='clinic-email'>Email</label>
                  <input type="email" className="form-control w-75" id='clinic-email' placeholder='Enter Clinic Email' value={email} onChange={(e) => setEmail(e.target.value)} disabled={noteditable} />
                </div>

                {/* <div className="spcialization d-flex align-items-center gap-3 mb-3">
                  <label className="form-label" htmlFor='spcialization'>Specialization</label>
                  <select className="form-select w-50" id='spcialization' value={specialization}  onChange={(e) => setSpecialization(e.target.value)}>
                    {specializations.map((spec, index) => (
                      <option value={spec.name} key={index}>{spec.name}</option>
                    ))}
                  </select>
                </div> */}
                <Adress onAddressChange={setAddress} />
                <hr />

                {/* Working Hours */}


                {/* Status */}
                <div className="status">
                  <p className='fw-bold mb-2'>Choose Status</p>
                  <div className="form-check form-check-inline">
                    <input type="radio" name="status" id="active" className="form-check-input" value={'active'} checked={status === 'active'} onChange={(e) => setStatus(e.target.value)} disabled={noteditable} />
                    <label htmlFor="active" className="form-check-label" >Active</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input type="radio" name="status" id="inactive" className="form-check-input" value={'inactive'} checked={status === 'inactive'} onChange={(e) => setStatus(e.target.value)} disabled={noteditable} />
                    <label htmlFor="inactive" className="form-check-label">Inactive</label>
                  </div>
                </div>
              </form>
            </div>



            {noteditable ? (

              <div className="modal-footer d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-danger" id='close-btn-edit' data-bs-dismiss="modal" style={{ width: '100px' }}>Close</button>
                <button type="button" className="custom-button" style={{ width: '100px' }} onClick={() => setNotEditable(false)}>Edit</button>
              </div>
            ) : (
              <div className="modal-footer d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-danger" id='close-btn-edit' data-bs-dismiss="modal" style={{ width: '100px' }} onClick={() => {

                  resetFields();
                  setNotEditable(true);
                }
                } >Cancel</button>
                <button type="button" className="custom-button" style={{ width: '100px' }} onClick={handleSave} disabled={noteditable || loading} >{loading ? <BeatLoader size={10} color="#fff" /> : "Edit Clinic"}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}
