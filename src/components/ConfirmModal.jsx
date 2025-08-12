import { createPortal } from 'react-dom';
import logo from '../assets/petut.png';
import { useState } from 'react';
import { BeatLoader } from 'react-spinners';

export default function ConfirmModal({ onDelete, setShowConfirm,  whatDelete }) {

    const [loading, setLoading] = useState(false);
    return createPortal (
        <div
            className="modal fade show d-block"
            id="confirmModal"
            tabIndex={-1}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }}
            aria-modal="true"
            role="dialog"
        >
            <div className="modal-dialog" style={{ marginTop: '250px' }}>
                <div className="modal-content">
                    <div className="modal-header  d-flex align-items-center justify-content-between py-0 pe-0">
                        <h5 className="modal-title">Confirm Deletion</h5>
                        <img src={logo} width="90" height="90" alt="logo" />
                    </div>
                    <div className="modal-body">
                        <p className="my-3">Are you sure you want to delete this {whatDelete} ?</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowConfirm(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={async () => {
                                setLoading(true);

                                await onDelete();
                                setShowConfirm(false);
                                setLoading(false);
                            }}
                        >
                            {loading ? ( <BeatLoader size={8} color="#fff" /> ) : "yes, delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
} 