import React, { Fragment, useState } from 'react'
import { toast } from 'react-toastify';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db,auth } from '../../firebase.js';
import { BeatLoader } from 'react-spinners';
import { createUserWithEmailAndPassword } from "firebase/auth";
import logo from '../../assets/petut.png';
import axios from 'axios'; 
export default function AddDoctorModal({doctors, setDoctors,fetchDoctors}) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [status, setStatus] = useState('active');
    const [profileImage, setProfileImage] = useState(null);

    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);


    const handleAddDoctor = async () => {
        //validate form fields
        if (!fullName.trim() || !email.trim() || !phone.trim() || !gender.trim() || !status.trim() || !password.trim() || password.length < 6 || password.length > 20 || !profileImage) {
            toast.error('Please fill in all the required fields', { autoClose: 3000 });
            return
        }
        if (!profileImage) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('image', profileImage);
        try {

            // upload image
            const response = await axios.post('https://api.imgbb.com/1/upload?key=da1538fed0bcb5a7c0c1273fc4209307', formData);



            const url = response.data.data.url;
            setImageUrl(url);
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                fullName,
                email,
                phone,
                gender,
                status,
                role: 'doctor',
                profileImage: url,
                createdAt: Timestamp.now()
            });
            toast.success('Doctor added successfully', { autoClose: 3000 });

            fetchDoctors().then(() => {
                setDoctors(doctors => [...doctors, {
                    id: user.uid,
                    fullName,
                    email,
                    phone,
                    gender,
                    status,
                    role: 'doctor',
                    profileImage: url,
                    createdAt: Timestamp.now()
                }]);
                document.getElementById('close-btn-modal').click();
            })
            //reset fields
            setFullName('');
            setEmail('');
            setPhone('');
            setPassword('');
            setGender('');
            setStatus('');
            setProfileImage(null);
            // setTimeout(() => {
            //     document.getElementById('close-btn-modal').click();
            //     // window.location.reload();
            // }, 3000);
        } catch (error) {
            toast.error("Failed to add doctor, error:" + error?.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }

    }
    return (
        <Fragment>
            <div className="modal fade" style={{ marginTop: '70px' }} id="adddoctor" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between py-0 pe-0">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Doctor Info</h1>
                            <img src={logo} width={'90px'} height={'90px'} alt="" />
                        </div>
                        <div className="modal-body">
                            <form action="#">
                                <div className="user-name d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="user-name" className="form-label">Full Name</label>
                                    <input type="text" className="form-control w-75" id="user-name" placeholder="Enter Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                </div>
                                <div className="user-email d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="user-email" className="form-label">Email</label>
                                    <input type="email" className="form-control w-75" id="user-email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="user-password d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="user-password" className="form-label">Password</label>
                                    <input type="password" className="form-control w-75" id="user-password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>

                                <div className="user-phone d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="user-phone" className="form-label">Phone</label>
                                    <input type="tel" className="form-control w-75" id="user-phone" placeholder="Enter Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                                <div className="user-image d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="user-image" className="form-label">Profile Image</label>
                                    <input type="file" className="form-control w-75" id="user-image"
                                        accept="image/*"
                                        onChange={(e) => setProfileImage(e.target.files[0])}
                                    />
                                </div>
                                {imageUrl && (
                                    <div>
                                        <p>Image URL:</p>
                                        <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a>
                                        <br />
                                        <img src={imageUrl} alt="preview" style={{ width: 100, marginTop: 10 }} />
                                    </div>
                                )}
                                <div className="gender mb-2 ">
                                    <p className='fw-bold mb-2'>Choose Gander</p>
                                    <div className="form-check form-check-inline">
                                        <input type="radio" name="gender" id="male" value={'male'} className="form-check-input" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} />
                                        <label htmlFor="male" className="form-check-label">Male</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input type="radio" name="gender" id="female" value={'female'} className="form-check-input" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} />
                                        <label htmlFor="female" className="">Female</label>
                                    </div>
                                </div>
                                <div className="status ">
                                    <p className='fw-bold mb-2'>Choose Status</p>
                                    <div className="form-check form-check-inline">
                                        <input type="radio" name="status" id="active" value={'active'} className="form-check-input" checked={status === 'active'} onChange={(e) => setStatus(e.target.value)} />
                                        <label htmlFor="active" className="form-check-label">Active</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input type="radio" name="status" id="inactive" value={'inactive'} className="form-check-input" checked={status === 'inactive'} onChange={(e) => setStatus(e.target.value)} />
                                        <label htmlFor="inactive" className="">Inactive</label>
                                    </div>
                                </div>

                            </form>
                        </div>
                        <div className="modal-footer d-flex gap-3">
                            <button type="button" className="btn btn-danger" id='close-btn-modal' data-bs-dismiss="modal" style={{ width: '100px' }}>Close</button>
                            <button type="button" className="custom-button" style={{ width: '120px' }} onClick={handleAddDoctor} disabled={loading}>{loading ? <BeatLoader size={10} color='#D9A741' /> : 'Add Doctor'}</button>
                        </div>

                    </div>
                </div>
            </div>
        </Fragment>
    )
}
