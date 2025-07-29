import { Fragment } from "react";
import { Outlet } from "react-router-dom";


export default function ContentAdminDash() {
    return (
        <Fragment>
            <main className='flex-1 ' style={{ marginTop: '120px', marginLeft: '40px', marginRight: '40px' }}>
                <Outlet />
            </main>
        </Fragment>
    )
}
