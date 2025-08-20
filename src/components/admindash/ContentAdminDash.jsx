import { Fragment } from "react";
import { Outlet } from "react-router-dom";

export default function ContentAdminDash() {
  return (
    <Fragment>
      <div className="background-secondary w-100" style={{ marginLeft: '0px', marginTop: '100px', minHeight: 'calc(100vh - 100px)' }}>
        <div className="container-fluid p-4">
          <Outlet />
        </div>
      </div>
    </Fragment>
  )
}
