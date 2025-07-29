import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import './contentdash.css'
export default function ContentDoctorDash() {
    return (
        <Fragment>
            <main className='flex-1 px-5 ' style={{marginTop:'120px'}}>
                <Outlet />
            </main>
        </Fragment>
    )
}
