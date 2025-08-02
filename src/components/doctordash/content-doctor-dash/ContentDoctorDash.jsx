import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import './contentdash.css'
export default function ContentDoctorDash() {
    return (
        <Fragment>
            <main className='container mx-auto' style={{marginTop:'120px'}}>
                <Outlet />
            </main>
        </Fragment>
    )
}
