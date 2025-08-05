import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
export default function ContentDoctorDash({doctorData, setDoctorData}) {
    return (
        <Fragment>
            <main className='container mx-auto' style={{marginTop:'120px'}}>
                <Outlet doctorData={doctorData} setDoctorData={setDoctorData} />
            </main>
        </Fragment>
    )
}
