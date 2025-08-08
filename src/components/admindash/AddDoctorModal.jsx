import React, { Fragment, useState } from 'react'
import { toast } from 'react-toastify';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase.js';
import { BeatLoader } from 'react-spinners';
import { createUserWithEmailAndPassword } from "firebase/auth";
import logo from '../../assets/petut.png';
import axios from 'axios';
export default function AddDoctorModal({ fetchDoctors }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [status, setStatus] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [cardFrontImage, setCardFrontImage] = useState(null);
    const [cardBackImage, setCardBackImage] = useState(null);
    const [idImage, setIdImage] = useState(null);
    const [experience, setExperience] = useState(null);
    const [description, setDescription] = useState(null);
    const [facebookLink, setFacebookLink] = useState(null);
    const [twitterLink, setTwitterLink] = useState(null);
    const [instagramLink, setInstagramLink] = useState(null);
    const [linkedinLink, setLinkedinLink] = useState(null);
    const [loading, setLoading] = useState(false);

    const resetFields = () => {
        setFullName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setGender('');
        setStatus('');
        setProfileImage(null);
        setCardFrontImage(null);
        setCardBackImage(null);
        setIdImage(null);
        setExperience(null);
        setDescription(null);
        setFacebookLink(null);
        setTwitterLink(null);
        setInstagramLink(null);
        setLinkedinLink(null);

    }



    const handleAddDoctor = async () => {
        //validate form fields
        if (!fullName.trim() || !email.trim() || !phone.trim() || !gender.trim() || !status.trim() || !password.trim() || password.length < 6 || password.length > 20 || !profileImage || !cardFrontImage || !cardBackImage || !idImage) {
            toast.error('Please fill in all the required fields', { autoClose: 3000 });
            return;
        }
        if (!profileImage) return;
        setLoading(true);

        //upload single image
        const uploadSingleImage = async (imageFile) => {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await axios.post('https://api.imgbb.com/1/upload?key=da1538fed0bcb5a7c0c1273fc4209307', formData);
            return response.data.data.url;
        };

        try {

            setLoading(true);
            // upload all image
            const profileUrl = await uploadSingleImage(profileImage);
            const cardFrontUrl = await uploadSingleImage(cardFrontImage);
            const cardBackUrl = await uploadSingleImage(cardBackImage);
            const idImageUrl = await uploadSingleImage(idImage);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                fullName,
                email,
                phone,
                gender,
                status,
                profileImage: profileUrl,
                role: 'doctor',
                doctorDetails: {
                    cardFrontImage: cardFrontUrl,
                    cardBackImage: cardBackUrl,
                    idImage: idImageUrl,
                    experience,
                    description,
                    socialMedia: {
                        facebook: facebookLink,
                        twitter: twitterLink,
                        instagram: instagramLink,
                        linkedin: linkedinLink
                    }
                },
                createdAt: Timestamp.now()
            });

            await fetchDoctors();
            toast.success('Doctor added successfully', { autoClose: 3000 });
            resetFields();
            setTimeout(() => {
                document.getElementById('close-btn-modal').click();
            }, 3000)
        } catch (error) {
            toast.error("Failed to add doctor, error:" + error?.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }

    }
    return (
        <Fragment>
            <div className="modal fade" id="adddoctor" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content ">
                        <div className="modal-header d-flex align-items-center justify-content-between py-0 pe-0">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">New Doctor</h1>
                            <img src={logo} width={'90px'} height={'90px'} alt="" />
                        </div>
                        <div className="modal-body">
                            <form action="#" >

                                <div className="doctor-name d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="doctor-name" className="form-label">Full Name</label>
                                    <input type="text" className="form-control w-75" id="doctor-name" placeholder="Enter Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                                </div>
                                <div className="doctor-email d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="doctor-email" className="form-label">Email Address</label>
                                    <input type="email" className="form-control w-75" id="doctor-email" placeholder="Enter Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="doctor-password d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="doctor-password" className="form-label">Password</label>
                                    <input type="password" className="form-control w-75" id="doctor-password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                <div className="doctor-phone d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="doctor-phone" className="form-label">Phone Number</label>
                                    <input type="tel" className="form-control w-75" id="doctor-phone" placeholder="Enter Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                </div>
                                <div className="frofile-image d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="frofile-image" className="form-label">Profile Image</label>
                                    <input type="file" className="form-control w-75" id="frofile-image"
                                        accept="image/*"
                                        onChange={(e) => setProfileImage(e.target.files[0])}
                                        required
                                    />
                                </div>
                                <div className="cart-front d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="cart-front" className="form-label">Card Front </label>
                                    <input type="file" className="form-control w-75" id="cart-front"
                                        accept="image/*"
                                        onChange={(e) => setCardFrontImage(e.target.files[0])}
                                        required
                                    />
                                </div>
                                <div className="cart-back d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="cart-back" className="form-label">Card Back</label>
                                    <input type="file" className="form-control w-75" id="cart-back"
                                        accept="image/*"
                                        onChange={(e) => setCardBackImage(e.target.files[0])}
                                        required
                                    />
                                </div>
                                <div className="id-image d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="id-image " className="form-label">ID Image</label>
                                    <input type="file" className="form-control w-75" id="id-image "
                                        accept="image/*"
                                        onChange={(e) => setIdImage(e.target.files[0])}
                                        required
                                    />
                                </div>
                                <div className="gender-status-experience d-flex align-items-center justify-content-between my-3 me-3">
                                    <div className="gender w-25"  >
                                        <select className="form-select w-100 " name="gender" id="gender" onChange={(e) => setGender(e.target.value)} cursor={'pointer'}>
                                            <option value="" >Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <div className="status w-25 " >
                                        <select className="form-select" name="status" id="status" onChange={(e) => setStatus(e.target.value)} cursor={'pointer'}>
                                            <option value="">Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="experience" >
                                        <input type="number" className="form-control" step={1} name="experience" id="experience" placeholder="Experience" value={experience} onChange={(e) => setExperience(e.target.value)} />
                                    </div>
                                </div>
                                <div className="textarea my-3 me-3">
                                    <textarea className="form-control" id="decription" placeholder="Enter About Doctor" maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} ></textarea>
                                </div>
                                <div className="social-media d-flex align-items-center  gap-3 mt-3 me-3">
                                    <input type="url" className="form-control w-50" id="doctor-name" placeholder="Facebook Link" value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} />
                                    <input type="url" className="form-control w-50" id="doctor-name" placeholder="Instagram Link" value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} />
                                    <input type="url" className="form-control w-50" id="doctor-name" placeholder="Twitter Link" value={twitterLink} onChange={(e) => setTwitterLink(e.target.value)} />
                                    <input type="url" className="form-control w-50" id="doctor-name" placeholder="Linkedin Link" value={linkedinLink} onChange={(e) => setLinkedinLink(e.target.value)} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer d-flex gap-3">
                            <button type="button" className="btn btn-danger" id='close-btn-modal' data-bs-dismiss="modal" style={{ width: '100px' }} onClick={resetFields}>Close</button>
                            <button type="button" className="custom-button" style={{ width: '120px' }} onClick={handleAddDoctor} disabled={loading}>{loading ? <BeatLoader size={10} color='#fff' /> : 'Add Doctor'}</button>
                        </div>

                    </div>
                </div>
            </div>
        </Fragment>
    )
}
