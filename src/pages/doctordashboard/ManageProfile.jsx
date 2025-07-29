import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IoIosCamera } from "react-icons/io";
import { auth,db } from '../../firebase.js';
// import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Address from '../../components/Address';
import { toast } from 'react-toastify';
import { updateDoc } from "firebase/firestore";
import axios from 'axios';


export default function Manageprofile() {
  const [selectImage, setSelectImage] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    image: ''
  });


  //get profile data from firebase
  useEffect(() => {
    const fetchProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        // const q = query(collection(db, "users"), where("role", "==", "doctor"));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
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
      // console.log('Image URL:', url);
      return url;

    } catch (error) {
      console.error("Error uploading image:", error);
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
        setProfileData({ ...profileData, image: uploadedImageUrl });
      }
    }
  };

  //update profile
  const handleUpdate = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          image: selectImage || profileData.image,
        });
        toast.success('Profile updated successfully', { autoClose: 3000 });
        setIsEditing(false);
        setProfileData({ ...profileData, image: selectImage || profileData.image });

      }
    } catch (error) {
      toast.error("Failed to update profile. Error: " + error.message, { autoClose: 3000 });
      // console.error("Error updating profile:", error);
    }
  };


  return (
    <Fragment>
      <nav aria-label="breadcrumb" className='container-fluid d-flex align-items-center justify-content-between w-100' style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', marginTop: '20px', padding: '10px 40px', borderRadius: '8px' }} >
        <span className='fw-bold'>Profile</span>
        <ol className="breadcrumb mb-0 py-3 text-align-center" >
          <li className="breadcrumb-item"><Link to="/" className='text-decoration-none' style={{ color: '#D9A741' }}>Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
          <li className="breadcrumb-item active" aria-current="page">Profile</li>
        </ol>
      </nav>
      <div className='container-fluid mt-4'>
        <div className='row  gap-5'>
          <div className='col-4'>
            <div className="col-12 position-relative w-100">
              <img className='w-100 rounded' src={selectImage ? selectImage : profileData.image ? profileData.image : "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"} alt="profile image" width={400} height={380} />
              <IoIosCamera size={30}
                onClick={() => document.getElementById("inputfile").click()}
                style={{
                  position: 'absolute',
                  top: '5%',
                  left: '5%',
                  color: '#D9A741',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  padding: '5px',
                  cursor: 'pointer'
                }} />
            </div>
            <div className="input-group my-3 w-75">
              <input type="file" className="form-control d-none" id="inputfile" onChange={handleImageChange} />
            </div>
          </div>
          <div className='col-7'>
            <form action="#">
              <div className="mb-3">
                <label htmlFor="profile-name" className="form-label">Name</label>
                <input type="text" className="form-control" id="profile-name" aria-describedby="emailHelp" disabled={isEditing} value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
              </div>
              <div className="mb-3">
                <label htmlFor="profile-email" className="form-label">Email</label>
                <input type="email" className="form-control" id="profile-email" disabled={isEditing} value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input type="tel" className="form-control" id="phone" disabled={isEditing} value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
              </div>
              {/* <div className="mb-3">
                <label for="address" className="form-label">Address</label>
                <input type="text" className="form-control" id="address" aria-describedby="emailHelp" value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} />
              </div> */}
              {!isEditing ? (
                <div className="d-flex gap-5 align-items-center justify-content-between">
                  <button type="button" className="btn text-white bg-danger w-50" onClick={() => setIsEditing(!isEditing)}>Cancel</button>
                  <button type="button" className="custom-button w-50" onClick={handleUpdate}>Update</button>
                </div>
              ) : (
                <button type="button" className="custom-button w-100" onClick={() => setIsEditing(!isEditing)}>Update Profile</button>
              )
              }
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
