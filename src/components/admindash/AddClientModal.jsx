import { Fragment, useState } from 'react'
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase.js';
import { toast } from 'react-toastify';
import logo from '../../assets/petut.png';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';

export default function AddClientModal({clients, fetchClients, setClients}) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    
    const resetFields = () => {
        setFullName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setGender('');
        setProfileImage(null);
        setProfileImage(null);
    }
    const handleAddClient = async () => {
        if (!fullName.trim() || !email.trim() || !phone.trim() || !gender) {
            toast.error('Please fill in all the required fields', { autoClose: 3000 });
            return
        }
        if (!profileImage) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('image', profileImage);
        try {
            setLoading(true)
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
                role: 'customer',
                profileImage: url,
                createdAt: Timestamp.now()
            })
            await fetchClients();
            //validate form fields
            toast.success('Client added successfully', { autoClose: 3000 });
            resetFields();

            setTimeout(() => {
                document.getElementById('close-btn-modal').click();
            }, 3000)
        } catch (error) {
            toast.error("Failed to add client, error:" + error.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Fragment>
            <div className="modal fade" style={{ paddingTop: '50px' }} id="addclient" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between py-0 pe-0">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Client Info</h1>
                            <img src={logo} width={'90px'} height={'90px'} alt="" />
                        </div>
                        <div className="modal-body">
                            <form action="#">
                                <div className="client-name d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="client-name" className="form-label">Full Name</label>
                                    <input type="text" className="form-control w-75" id="client-name" placeholder="Enter Client Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                </div>
                                <div className="client-email d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="client-email" className="form-label">Email Address</label>
                                    <input type="email" className="form-control w-75" id="client-email" placeholder="Enter Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="client-password d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="client-password" className="form-label">Password</label>
                                    <input type="password" className="form-control w-75" id="client-password" placeholder="Enter Client password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="client-phone d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="client-phone" className="form-label">Phone Number</label>
                                    <input type="tel" className="form-control w-75" id="client-phone" placeholder="Enter Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
                                        <p>Image :</p>
                                        <img src={imageUrl} alt="preview" style={{ width: 100, marginTop: 10 }} />
                                    </div>
                                )}

                                <div className="gender mb-2 d-flex align-items-center gap-3">
                                    <label htmlFor="gender" className="form-label">Gender</label>
                                    <select className="form-select w-25" name="gender" id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                                        <option value="">Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer d-flex gap-3">
                            <button type="button" className="btn btn-danger" id='close-btn-modal' data-bs-dismiss="modal" style={{ width: '100px' }} onClick={resetFields}>Close</button>
                            <button type="button" className="custom-button" style={{ width: '100px' }} onClick={handleAddClient} disabled={loading}>{loading ? <BeatLoader size={10} color='#fff' /> : 'Add Client'}</button>
                        </div>

                    </div>
                </div>
            </div>
        </Fragment>
    )
}
