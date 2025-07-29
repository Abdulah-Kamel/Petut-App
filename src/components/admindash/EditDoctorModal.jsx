/* eslint-disable react-hooks/rules-of-hooks */
import { doc, updateDoc } from 'firebase/firestore';
import { Fragment, useState } from 'react'
import { toast } from 'react-toastify';
import { db } from '../../firebase.js';
import logo from '../../assets/petut.png';

import { BeatLoader } from 'react-spinners';

export default function EditDoctorModal({ doctor, modalId }) {
    if (!doctor) return null;
    const { fullName: defaultName, email: defaultEmail, phone: defaultPhone, gender: defaultGender, status: defaultStatus, profileImage: defaultProfileImage } = doctor;
    const [fullName, setFullName] = useState(defaultName);
    const [email, setEmail] = useState(defaultEmail);
    const [phone, setPhone] = useState(defaultPhone);
    const [gender, setGender] = useState(defaultGender);
    const [status, setStatus] = useState(defaultStatus);
    const [profileImage, setProfileImage] = useState(defaultProfileImage);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');

    const [loading, setLoading] = useState(false);


    const [isEditable, setIsEditable] = useState(false);

    const resetFields = () => {
        setFullName(defaultName);
        setEmail(defaultEmail);
        setPhone(defaultPhone);
        setGender(defaultGender);
        setStatus(defaultStatus);
        setProfileImage(defaultProfileImage);
    }

    //edit doctor in firestore 
    const handleSave = async () => {
        if (!fullName.trim() || !email.trim() || !phone.trim() || !gender.trim() || !status.trim() || !profileImage) {
            toast.error('Please fill in all the required fields', { autoClose: 3000 });
            return
        }
        setLoading(true);
        try {
            const finalImage = uploadedImageUrl || profileImage;
            const docRef = doc(db, 'users', modalId);
            await updateDoc(docRef, {
                fullName,
                email,
                phone,
                gender,
                status,
                profileImage: finalImage
            })
            setIsEditable(false);
            toast.success('Doctor updated successfully', { autoClose: 3000 });
            setTimeout(() => {
                document.getElementById('close-btn-edit').click();
                window.location.reload();
            }, 3000);
        } catch (error) {
            toast.error("Failed to update doctor, error:" + error.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    }
    return (
        <Fragment>
            <div className="modal fade" style={{ paddingTop: '0px' }} id={`editdoctor-${modalId}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between py-0 pe-0">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel"> Edit Doctor Info</h1>
                            <img src={logo} alt="logo" width={'90px'} height={'90px'} />
                        </div>
                        <div className="modal-body">
                            <form action="#">
                                <div className="doctor-name d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="doctor-name" className="form-label">Full Name</label>
                                    <input type="text" className="form-control w-75" id="doctor-name" placeholder="Enter Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={!isEditable} />
                                </div>
                                <div className="doctor-address d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="doctor-address" className="form-label">Email</label>
                                    <input type="email" className="form-control w-75" id="doctor-address" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditable} />
                                </div>
                                <div className="doctor-address d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="doctor-address" className="form-label">Phone</label>
                                    <input type="tel" className="form-control w-75" id="doctor-address" placeholder="Enter Phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isEditable} />
                                </div>
                                <div className="product-image d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="product-image" className="form-label">Image</label>
                                    <input type="file" className="form-control w-75" id="product-image" accept="image/*" onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            // setImageUrl(file); // still save the File if needed
                                            const formData = new FormData();
                                            formData.append("image", file);

                                            try {
                                                const res = await fetch(`https://api.imgbb.com/1/upload?key=da1538fed0bcb5a7c0c1273fc4209307`, {
                                                    method: "POST",
                                                    body: formData,
                                                });
                                                const data = await res.json();
                                                if (data.success) {
                                                    setUploadedImageUrl(data.data.url);
                                                    setProfileImage(data.data.url); //  set final image URL
                                                    toast.success("Image uploaded successfully");
                                                } else {
                                                    toast.error("Failed to upload image.");
                                                }
                                            } catch (err) {
                                                toast.error("Upload error: " + err.message);
                                            }
                                        }
                                    }} disabled={!isEditable} />
                                </div>
                                {(uploadedImageUrl || profileImage) && (
                                    <div>
                                        <p>Image:</p>

                                        <img
                                            src={profileImage}
                                            alt="Doctor image"
                                            style={{ width: 100, marginBottom: 10 }}
                                        />
                                    </div>
                                )}
                                <div className="gender-and-status d-flex align-items-center gap-5">
                                    <div className="gender mb-2 ">
                                        <p className='fw-bold mb-2'>Choose Gander</p>
                                        <div className="form-check form-check-inline">
                                            <input type="radio" name="gender" id="male" value={'male'} className="form-check-input" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} disabled={!isEditable} />
                                            <label htmlFor="male" className="form-check-label">Male</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input type="radio" name="gender" id="female" value={'female'} className="form-check-input" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} disabled={!isEditable} />
                                            <label htmlFor="female" className="">Female</label>
                                        </div>
                                    </div>
                                    <div className="status ">
                                        <p className='fw-bold mb-2'>Choose Status</p>
                                        <div className="form-check form-check-inline">
                                            <input type="radio" name="status" id="active" value={'active'} className="form-check-input" checked={status === 'active'} onChange={(e) => setStatus(e.target.value)} disabled={!isEditable} />
                                            <label htmlFor="active" className="form-check-label">Active</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input type="radio" name="status" id="inactive" value={'inactive'} className="form-check-input" checked={status === 'inactive'} onChange={(e) => setStatus(e.target.value)} disabled={!isEditable} />
                                            <label htmlFor="inactive" className="">Inactive</label>
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>


                        <div className="modal-footer">

                            {isEditable ? (
                                <div className="d-flex gap-3 w-100 justify-content-end">
                                    <button type="button" className="btn text-white bg-danger w-25 " onClick={() => {

                                        resetFields();
                                        setIsEditable(false);
                                    }
                                    } >Cancel</button>
                                    <button type="button" className="custom-button w-25 d-flex align-items-center justify-content-center" onClick={handleSave} disabled={!isEditable || loading}>{loading ? <BeatLoader size={10} color="#fff" /> : "Edit"} </button>
                                </div>
                            ) : (
                                <>
                                    <button type="button" className="custom-button w-25 text-white bg-danger" id="close-btn-edit" data-bs-dismiss="modal" aria-label="Close">Close</button>
                                    <button type="button" className="custom-button w-25" onClick={() => setIsEditable(true)}>Edit Doctor</button>
                                </>

                            )
                            }
                        </div>


                    </div>
                </div>
            </div>
        </Fragment>
    )
}
