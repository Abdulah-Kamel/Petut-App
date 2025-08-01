import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
export default function ContentDoctorDash() {
    return (
        <Fragment>
            <main className='flex-1 px-5 ' style={{marginTop:'120px',marginLeft:"80px"}}>
                <Outlet />
            </main>
        </Fragment>
    )
}
