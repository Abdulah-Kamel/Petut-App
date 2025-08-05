import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Clinic from '../../components/doctordash/Clinic'
import { RiAddLine } from "react-icons/ri";
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase.js';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth';
import AddClinicModal from '../../components/AddClinicModal';

export default function Manageclinics() {
  const [loading, setLoading] = useState(true);
  const [clinics, setClinics] = useState([]);

  // const [showConfirm, setShowConfirm] = useState(false);


  // get clinics from Firebase
  const getClinics = async (userId) => {
    if (!userId) {
      toast.error("User ID is undefined");
      return;
    }
    setLoading(true);
    try {
      const clinicsRef = collection(db, 'clinics');
      const q = query(clinicsRef, where("doctorId", "==", userId));
      const querySnapshot = await getDocs(q);
      const clinicsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClinics(clinicsData);
    } catch (error) {
      toast.error("Failed to fetch clinics, error:" + error.message, { autoClose: 3000 });
    } finally {
      setLoading(false);
    }

  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getClinics(user.uid);
      } else {
        toast.error("User is not logged in.", { autoClose: 3000 });
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);




  //Delete clinic from firebase
  const handleDeleteClinic = async (id) => {
    try {
      await deleteDoc(doc(db, 'clinics', id));
      setClinics(clinics => clinics.filter(clinic => clinic.id !== id))
      toast.success('Clinic deleted successfully', { autoClose: 3000 });
      // window.location.reload();
    } catch (err) {
      toast.error("Failed to delete clinic, error:" + err.message, { autoClose: 3000 });
    }
  }
  return (
    <Fragment>
      <nav aria-label="breadcrumb" className='container-fluid d-flex align-items-center justify-content-between ' style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', marginTop: '20px', padding: '10px 40px', borderRadius: '8px' }} >
        <span className='fw-bold'>Clinics</span>
        <ol className="breadcrumb mb-0 py-3 text-align-center" >
          <li className="breadcrumb-item"><Link to="/" className='text-decoration-none' style={{ color: '#D9A741' }}>Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
          <li className="breadcrumb-item active" aria-current="page">Clinics</li>
        </ol>
      </nav>
      <div className="container-fluid mt-4">
        <div className="row align-items-center">
          <div className="left col-10">
            <h1 className='fw-bold fs-5'>Associated clinics</h1>
            <p>Managing and monitoring the clinics you work in</p>
          </div>
          <div className="right col-2">
            <button type="button" className="custom-button" data-bs-toggle="modal" data-bs-target="#addclinic" ><RiAddLine size={20} />New Clinic</button>
          </div>
          <AddClinicModal loading={loading} setLoading={setLoading} getClinics={() => getClinics(auth.currentUser.uid)} />
        </div>
      </div>


      {loading ? (<h3 className='text-center mt-5'><BeatLoader color="#D9A741" /></h3>) : clinics.length === 0 ? (<h3 className='text-center'>No clinics found</h3>) : (

        <div className="container-fluid my-4 ">
          <div className="row gap-4 justify-content-start">
            {clinics.map((clinic) => (
              <Clinic
                key={clinic.id}
                clinic={clinic}
                onDelete={handleDeleteClinic}
              />
            ))}

          </div>
        </div>
      )}
    </Fragment>
  )
}
