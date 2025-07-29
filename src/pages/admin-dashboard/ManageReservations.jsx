import React, { Fragment } from 'react'
import ReservationTable from '../../components/admindash/ReservationTable'
// import { RiAddLine } from "react-icons/ri";
// import AddReservation from '../../components/admindash/AddReservation';

export default function ManageReservations() {

    
    return (
        <Fragment>
            <div className="container-fluid ">
                <div className=''>
                    <h1>Reservations schedule</h1>
                    <p className=''>Managing all clinics and responsible doctors</p>
                </div>

                <ReservationTable />
            </div>
        </Fragment>
    )
}
