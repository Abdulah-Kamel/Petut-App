import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IoIosCamera } from "react-icons/io";
import { auth, db } from '../../firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { updateDoc } from "firebase/firestore";
import axios from 'axios';
import { getAuth, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "firebase/auth";
import { BeatLoader } from 'react-spinners';
import { useDarkMode } from '../../context/DarkModeContext.jsx';



export default function Manageprofile() {
  const [selectImage, setSelectImage] = useState(null);
  const [notEditable, setNotEditable] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const { isDarkMode } = useDarkMode();

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profileImage: ''
  });


  //get profile data from firebase
  useEffect(() => {
    const fetchProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(data);
          setSelectImage(data.profileImage);
        }
      }
    };

    fetchProfileData();
  }, []);
  //upload image
  const uploadImageToImgbb = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
      const response = await axios.post('https://api.imgbb.com/1/upload?key=da1538fed0bcb5a7c0c1273fc4209307', formData);
      const url = response.data.data.url;
      setSelectImage(url);
      return url;
    } catch (error) {
      toast.error("Image upload failed");
      return null;
    }
  };
  // upload image
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadedImageUrl = await uploadImageToImgbb(file);
      if (uploadedImageUrl) {
        setSelectImage(uploadedImageUrl);
        setProfileData(profileData => ({ ...profileData, profileImage: uploadedImageUrl }));
      }
    }
  };

  //update profile
  const handleUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.", { autoClose: 3000 });
      return;
    }
    if (!currentPassword) {
      toast.error("Please enter your current password.", { autoClose: 3000 });
      return;
    }
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      if (newPassword) {
        await updatePassword(user, newPassword);
      }
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          fullName: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
          profileImage: selectImage || profileData.profileImage,
        });
        toast.success('Profile updated successfully', { autoClose: 3000 });
        setNotEditable(!notEditable);
        setProfileData(profileData => ({ ...profileData, profileImage: selectImage || profileData.profileImage }));
        setCurrentPassword('');
      }
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        toast.error("The current password you entered is incorrect.", { autoClose: 3000 });
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many attempts. Please try again later.", { autoClose: 3000 });
      } else {
        toast.error("Failed to update profile. Error: " + error.message, { autoClose: 3000 });
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <Fragment>
      <nav aria-label="breadcrumb" className={`container-fluid d-flex align-items-center justify-content-between w-100 ${isDarkMode ? 'bg-dark-2 text-white' : 'bg-white'}`} style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', marginTop: '20px', padding: '10px 40px', borderRadius: '8px' }} >
        <span className='fw-bold'>Profile</span>
        <ol className="breadcrumb mb-0 py-3 text-align-center" >
          <li className="breadcrumb-item"><Link to="/" className='text-decoration-none' style={{ color: '#D9A741' }}>Home</Link></li>
          <li className={`breadcrumb-item active ${isDarkMode ? 'text-white-50' : ''}`} aria-current="page">Dashboard</li>
          <li className={`breadcrumb-item active ${isDarkMode ? 'text-white-50' : ''}`} aria-current="page">Profile</li>
        </ol>
      </nav>
      <div className='container-fluid my-4'>
        <div className='row'>
          <div className='col-md-4'>
            <div className={`p-3 rounded ${isDarkMode ? 'bg-dark-2' : 'bg-light'}`}>
              <div className="position-relative d-flex align-items-center justify-content-center">
                <img className='rounded-3' src={profileData.profileImage || selectImage} alt="profile image" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                {!notEditable && (
                  <IoIosCamera size={30}
                    onClick={() => document.getElementById("inputfile").click()}
                    style={{
                      position: 'absolute',
                      top: '5%',
                      left: '5%',
                      color: '#D9A741',
                      backgroundColor: isDarkMode ? '#343a40' : '#fff',
                      borderRadius: '50%',
                      padding: '5px',
                      cursor: 'pointer'
                    }} />
                )}
              </div>
              <div className="input-group my-3">
                <input type="file" className="form-control d-none" id="inputfile" onChange={handleImageChange} disabled={notEditable} />
              </div>
            </div>
          </div>
          <div className='col-md-8'>
            <form action="#" className={`p-4 rounded ${isDarkMode ? 'bg-dark-2' : 'bg-light'}`}>
              <div className="mb-3">
                <label htmlFor="profile-name" className={`form-label ${isDarkMode ? 'text-white' : ''}`}>Name</label>
                <input type="text" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} id="profile-name" disabled={notEditable} value={profileData.fullName} onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })} />
              </div>
              <div className="mb-3">
                <label htmlFor="profile-email" className={`form-label ${isDarkMode ? 'text-white' : ''}`}>Email</label>
                <input type="email" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} id="profile-email" disabled={notEditable} value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className={`form-label ${isDarkMode ? 'text-white' : ''}`}>Phone</label>
                <input type="tel" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} id="phone" disabled={notEditable} value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
              </div>
              <div className="mb-3">
                <label htmlFor="current-password" className={`form-label ${isDarkMode ? 'text-white' : ''}`}>Current Password</label>
                <input type="password" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} id="current-password" disabled={notEditable} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="new-password" className={`form-label ${isDarkMode ? 'text-white' : ''}`}>New Password</label>
                <input type="password" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} id="new-password" disabled={notEditable} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="confirm-password" className={`form-label ${isDarkMode ? 'text-white' : ''}`}>Confirm New Password</label>
                <input type="password" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} id="confirm-password" disabled={notEditable} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              {!notEditable ? (
                <div className="d-flex gap-3">
                  <button type="button" className="btn btn-secondary w-50" onClick={() => setNotEditable(!notEditable)}>Cancel</button>
                  <button type="button" className="btn btn-primary w-50" onClick={handleUpdate} disabled={loading}>{loading ? <BeatLoader color='#fff' size={8} /> : "Update"}</button>
                </div>
              ) : (
                <button type="button" className="btn btn-primary w-100" onClick={() => setNotEditable(!notEditable)}>Update Profile</button>
              )
              }
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
