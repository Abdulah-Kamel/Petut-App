/* eslint-disable react-hooks/rules-of-hooks */
import { doc, updateDoc } from 'firebase/firestore';
import { Fragment, useState } from 'react'
import { toast } from 'react-toastify';
import { db } from '../../firebase.js';
import logo from '../../assets/petut.png';

import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import { setDoc } from 'firebase/firestore';

export default function EditDoctorModal({ doctor, setDoctors, modalId }) {
    if (!doctor) return null;
    const { fullName: defaultName, email: defaultEmail, phone: defaultPhone, gender: defaultGender, status: defaultStatus, doctorDetails = {} } = doctor;

    const { profileImage: defaultProfileImage = '', cardFrontImage: defaultCardFrontImage = '', cardBackImage: defaultCardBackImage = '', idImage: defaultIdImage = '', experience: defaultExperience = '', description: defaultDescription = '', socialMedia = {} } = doctorDetails;

    const { facebook: defaultFacebookLink = '', twitter: defaultTwitterLink = '', instagram: defaultInstagramLink = '', linkedin: defaultLinkedinLink = '' } = socialMedia;



    const [fullName, setFullName] = useState(defaultName);
    const [email, setEmail] = useState(defaultEmail);
    const [phone, setPhone] = useState(defaultPhone);
    const [gender, setGender] = useState(defaultGender);
    const [status, setStatus] = useState(defaultStatus);
    const [profileImage, setProfileImage] = useState(defaultProfileImage);
    const [cardFrontImage, setCardFrontImage] = useState(defaultCardFrontImage);
    const [cardBackImage, setCardBackImage] = useState(defaultCardBackImage);
    const [idImage, setIdImage] = useState(defaultIdImage);
    const [experience, setExperience] = useState(defaultExperience);
    const [description, setDescription] = useState(defaultDescription);
    const [facebookLink, setFacebookLink] = useState(defaultFacebookLink);
    const [twitterLink, setTwitterLink] = useState(defaultTwitterLink);
    const [instagramLink, setInstagramLink] = useState(defaultInstagramLink);
    const [linkedinLink, setLinkedinLink] = useState(defaultLinkedinLink);

    const [loading, setLoading] = useState(false);


    const [notEditable, setNotEditable] = useState(true);

    const resetFields = () => {
        setFullName(defaultName);
        setEmail(defaultEmail);
        setPhone(defaultPhone);
        setGender(defaultGender);
        setStatus(defaultStatus);
        setProfileImage(defaultProfileImage);
        setCardFrontImage(defaultCardFrontImage);
        setCardBackImage(defaultCardBackImage);
        setIdImage(defaultIdImage);
        setExperience(defaultExperience);
        setDescription(defaultDescription);
        setFacebookLink(defaultFacebookLink);
        setTwitterLink(defaultTwitterLink);
        setInstagramLink(defaultInstagramLink);
        setLinkedinLink(defaultLinkedinLink);
    }

    //edit doctor in firestore 
    const handleSave = async () => {
        if (!fullName.trim() || !email.trim() || !phone.trim() || !gender.trim() || !status.trim() || !profileImage || !cardFrontImage || !cardBackImage || !idImage || !experience || !description) {
            toast.error('Please fill in all the required fields', { autoClose: 3000 });
            return
        }
        setLoading(true);

        const uploadSingleImage = async (imageFile) => {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await axios.post('https://api.imgbb.com/1/upload?key=da1538fed0bcb5a7c0c1273fc4209307', formData);
            return response.data.data.url;
        };
        try {

            const finalProfileImage = typeof profileImage === "string" ? profileImage : await uploadSingleImage(profileImage);
            const finalCardFrontImage = typeof cardFrontImage === "string" ? cardFrontImage : await uploadSingleImage(cardFrontImage);
            const finalCardBackImage = typeof cardBackImage === "string" ? cardBackImage : await uploadSingleImage(cardBackImage);
            const finalIdImage = typeof idImage === "string" ? idImage : await uploadSingleImage(idImage);

            const docRef = doc(db, 'users', modalId);
            await updateDoc(docRef, {
                fullName,
                email,
                phone,
                gender,
                status,
                doctorDetails: {
                    profileImage: finalProfileImage,
                    cardFrontImage: finalCardFrontImage,
                    cardBackImage: finalCardBackImage,
                    idImage: finalIdImage,
                    experience,
                    description,
                    socialMedia: {
                        facebook: facebookLink,
                        twitter: twitterLink,
                        instagram: instagramLink,
                        linkedin: linkedinLink
                    }
                },
            })
            setNotEditable(true);
            toast.success('Doctor updated successfully', { autoClose: 3000 });
            setTimeout(() => {
                document.getElementById('close-btn-edit').click();
                setDoctors([...DoctorsTable, { fullName, email, phone, gender, status, profileImage, cardFrontImage, cardBackImage, idImage, experience, description, facebookLink, twitterLink, instagramLink, linkedinLink }]);
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
                                    <input type="text" className="form-control w-75" id="doctor-name" placeholder="Enter Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={notEditable} />
                                </div>
                                <div className="doctor-address d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="doctor-address" className="form-label">Email Address</label>
                                    <input type="email" className="form-control w-75" id="doctor-address" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={notEditable} />
                                </div>
                                <div className="doctor-address d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="doctor-address" className="form-label">Phone Number</label>
                                    <input type="tel" className="form-control w-75" id="doctor-address" placeholder="Enter Phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={notEditable} />
                                </div>

                                <div className="frofile-image d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="frofile-image" className="form-label">Profile Image</label>
                                    <input type="file" className="form-control w-75" id="frofile-image"
                                        accept="image/*"

                                        onChange={(e) => setProfileImage(e.target.files[0])}
                                        disabled={notEditable}
                                        required
                                    />
                                </div>
                                <div className="cart-front d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="cart-front" className="form-label">Card Front </label>
                                    <input type="file" className="form-control w-75" id="cart-front"
                                        accept="image/*"

                                        onChange={(e) => setCardFrontImage(e.target.files[0])}
                                        disabled={notEditable}
                                        required
                                    />
                                </div>
                                <div className="cart-back d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="cart-back" className="form-label">Card Back</label>
                                    <input type="file" className="form-control w-75" id="cart-back"
                                        accept="image/*"

                                        onChange={(e) => setCardBackImage(e.target.files[0])}
                                        disabled={notEditable}
                                        required
                                    />
                                </div>
                                <div className="id-image d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="id-image " className="form-label">ID Image</label>
                                    <input type="file" className="form-control w-75" id="id-image "
                                        accept="image/*"

                                        onChange={(e) => setIdImage(e.target.files[0])}
                                        disabled={notEditable}
                                        required
                                    />
                                </div>
                                <div className="gender-status-experience d-flex align-items-center justify-content-between my-3 me-3">
                                    <div className="gender w-25"  >
                                        <select className="form-select w-100 " name="gender" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} cursor={'pointer'} disabled={notEditable}>
                                            <option value="" >Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <div className="status w-25 " >
                                        <select className="form-select" name="status" id="status" value={status} onChange={(e) => setStatus(e.target.value)} cursor={'pointer'} disabled={notEditable}>
                                            <option value="">Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="experience" >
                                        <input type="number" className="form-control" step={1} name="experience" id="experience" placeholder="Experience" value={experience} onChange={(e) => setExperience(e.target.value)} disabled={notEditable} />
                                    </div>
                                </div>
                                <div className="textarea my-3 me-3">
                                    <textarea className="form-control" id="decription" placeholder="Enter About Doctor" maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} disabled={notEditable}></textarea>
                                </div>
                                <div className="social-media d-flex align-items-center  gap-3 mt-3 me-3">
                                    <input type="url" className="form-control w-50" id="doctor-name" placeholder="Facebook Link" value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} disabled={notEditable} />
                                    <input type="url" className="form-control w-50" id="doctor-name" placeholder="Instagram Link" value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} disabled={notEditable} />
                                    <input type="url" className="form-control w-50" id="doctor-name" placeholder="Twitter Link" value={twitterLink} onChange={(e) => setTwitterLink(e.target.value)} disabled={notEditable} />
                                    <input type="url" className="form-control w-50" id="doctor-name" placeholder="Linkedin Link" value={linkedinLink} onChange={(e) => setLinkedinLink(e.target.value)} disabled={notEditable} />
                                </div>





                            </form>
                        </div>


                        <div className="modal-footer">

                            {!notEditable ? (
                                <div className="d-flex gap-3 w-100 justify-content-end">
                                    <button type="button" className="btn text-white bg-danger w-25 " onClick={() => {

                                        resetFields();
                                        setNotEditable(true);
                                    }
                                    } >Cancel</button>
                                    <button type="button" className="custom-button w-25 d-flex align-items-center justify-content-center" onClick={handleSave} disabled={notEditable || loading}>{loading ? <BeatLoader size={10} color="#fff" /> : "Edit"} </button>
                                </div>
                            ) : (
                                <>
                                    <button type="button" className="custom-button w-25 text-white bg-danger" id="close-btn-edit" data-bs-dismiss="modal" aria-label="Close">Close</button>
                                    <button type="button" className="custom-button w-25" onClick={() => setNotEditable(false)}>Edit Doctor</button>
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
