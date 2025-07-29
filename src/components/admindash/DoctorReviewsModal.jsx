import React, { Fragment } from 'react'
import logo from '../../assets/petut.png'
export default function DoctorReviewsModal() {
    return (
        <Fragment>
            <div className="modal fade" id="review" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between">
                            <h5 className="modal-title">Doctor Reviews</h5>
                            <img src={logo} width={'90px'} height={'90px'} alt="logo" />

                        </div>
                        <div className="modal-body">

                        </div>
                        <div className="modal-footer d-flex justify-content-end gap-2">
                            <button type="button" className="btn btn-danger" id='close-btn-edit' data-bs-dismiss="modal" style={{ width: '100px' }}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
