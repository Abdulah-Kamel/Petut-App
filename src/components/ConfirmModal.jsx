import { createPortal } from 'react-dom';
import logo from '../assets/petut.png';
import { useState } from 'react';
import { BeatLoader } from 'react-spinners';

export default function ConfirmModal({ onDelete, setShowConfirm, selectedId, whatDelete }) {
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setShowConfirm(false);
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await onDelete(selectedId);
            setLoading(false);
            handleClose();
        } catch (err) {
            setLoading(false);
        }
    };

    return createPortal(
        <div
            className="modal-backdrop"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                zIndex: 1050,
            }}
        >
            <div
                className="modal d-block"
                tabIndex={-1}
                style={{ display: "block", zIndex: 1060 }}
            >
                <div className="modal-dialog" style={{ marginTop: '250px' }}>
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between py-0 pe-0">
                            <h5 className="modal-title">Confirm Deletion</h5>
                            <img src={logo} width="90" height="90" alt="logo" />
                        </div>
                        <div className="modal-body">
                            <p className="my-3">Are you sure you want to delete this {whatDelete}?</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                {loading ? (
                                    <BeatLoader size={8} color="#fff" />
                                ) : (
                                    "Yes, delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
