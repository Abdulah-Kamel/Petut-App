/* eslint-disable react-hooks/rules-of-hooks */
import { doc, updateDoc } from 'firebase/firestore';
import { Fragment, useState } from 'react'
import { db } from '../../firebase.js';
import { toast } from 'react-toastify';

import { BeatLoader } from 'react-spinners';
import logo from '../../assets/petut.png';
export default function EditClientModal({ client, setClients, modalId }) {
    if (!client) return null;
    const { fullName: defaultName, email: defaultEmail, phone: defaultPhone, gender: defaultGender, profileImage: defaultProfileImage } = client;
    const [fullName, setFullName] = useState(defaultName)
    const [email, setEmail] = useState(defaultEmail)
    const [phone, setPhone] = useState(defaultPhone)
    const [gender, setGender] = useState(defaultGender)
    const [profileImage, setProfileImage] = useState(defaultProfileImage);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [notEditable, setNotEditable] = useState(true);

    const [loading, setLoading] = useState(false);

    const resetFields = () => {
        setFullName(defaultName);
        setEmail(defaultEmail);
        setPhone(defaultPhone);
        setGender(defaultGender);
        setProfileImage(defaultProfileImage);


    }

    //edit client in firestore
    const handleSave = async () => {
        if (!fullName.trim() || !email.trim() || !phone.trim() || !gender || !profileImage) {
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
            const finalImage = await uploadSingleImage(profileImage);

            const docRef = doc(db, 'users', modalId);
            await updateDoc(docRef, {
                fullName,
                email,
                phone,
                gender,
                profileImage: finalImage
            })
            setNotEditable(true);
            toast.success('Client updated successfully', { autoClose: 3000 });
            setTimeout(() => {
                document.getElementById(`close-btn-edit-${modalId}`).click();
                setClients([...client, { fullName, email, phone, gender, profileImage: finalImage }]);
            }, 3000);
        } catch (error) {
            toast.error("Failed to update client, error:" + error.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    }
    return (
        <Fragment>
            <div className="modal fade" style={{ paddingTop: '30px' }} id={`editclient-${modalId}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between py-0 pe-0">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Client Info</h1>
                            <img src={logo} width={'90px'} height={'90px'} alt="" />
                        </div>
                        <div className="modal-body p-1">
                            <form action="#" className='p-3 pb-0'>
                                <div className="doctor-info ">
                                    <div className="client-name d-flex align-items-center gap-3 mb-3  ">
                                        <label htmlFor="client-name" className="form-label mb-0">Full Name</label>
                                        <input type="text" className="form-control w-50" id="client-name" placeholder='Enter Client Name' value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={notEditable} />
                                    </div>
                                    <div className="client-email d-flex align-items-center gap-3 mb-3">
                                        <label htmlFor="client-email" className="form-label mb-0">Email</label>
                                        <input type="email" className="form-control w-50" id="client-email" placeholder='Enter Client Email' value={email} onChange={(e) => setEmail(e.target.value)} disabled={notEditable} />
                                    </div>
                                    <div className="client-phone d-flex align-items-center gap-3 mb-3">
                                        <label htmlFor="client-phone" className="form-label mb-0">Phone</label>
                                        <input type="number" className="form-control w-50" id="client-phone" placeholder='Enter Client Phone' value={phone} onChange={(e) => setPhone(e.target.value)} disabled={notEditable} />
                                    </div>
                                    <div className="product-image d-flex align-items-center gap-3 mb-3">
                                        <label htmlFor="product-image" className="form-label">Image</label>
                                        <input type="file" className="form-control w-75" id="product-image" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} disabled={notEditable} />
                                    </div>
                                    <div className="gender mb-2 d-flex align-items-center gap-3">
                                        <label htmlFor="gender" className="form-label">Gender</label>
                                        <select className="form-select w-25" name="gender" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} disabled={notEditable}>
                                            <option value="">Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
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
                                    <button type="button" className="custom-button w-25 text-white bg-danger" data-bs-dismiss="modal" aria-label="Close" id="close-btn-edit">Close</button>
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
