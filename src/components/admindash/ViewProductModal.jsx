import React, { Fragment } from 'react'
import logo from '../../assets/petut.png';
export default function ViewProductModal({ product, modalId }) {
    return (
        <Fragment>
            <div className="modal fade " style={{ paddingTop: '70px' }} id={`viewproduct-${modalId}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header py-0 d-flex align-items-center justify-content-between">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Products Details</h1>
                            <img src={logo} width={'90px'} height={'90px'} alt="logo" />
                        </div>
                        <div className="modal-body ">
                            <div className="d-flex align-items-center " style={{ gap: '50px' }}>
                                <div className="product-image col-md-4">
                                    <img src={product.imageURL} alt="product-image" className='w-100' />
                                </div>
                                <div className="details col-md-7">
                                    <div className="product-name mb-3"><span className="fw-bold">Clinic Name :</span> {product.productName}</div>
                                    <div className="product-description mb-3"><span className="fw-bold">Description : </span> {product.description}</div>
                                    <div className="product-price mb-3"><span className="fw-bold">Price : </span> {product.price}</div>
                                    <div className="product-category mb-3"><span className="fw-bold me-2">Category : </span> <span style={{ color: 'white', backgroundColor: product.category === 'cat' ? '#A66DD4   ' : product.category === 'dog' ? '#4DA6FF  ' : product.category === 'bird' ? '#4CAF50 ' : product.category === 'toys' ? '#FFA726' : '#A66DD4' , fontSize: '14px' }} className='px-3 py-1 rounded rounded-2 '>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span></div>
                                    <div className="product-rate mb-3"><span className="fw-bold">Rate : </span> {product.rate}</div>
                                </div>

                            </div>

                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" id='close-btn-edit' data-bs-dismiss="modal" style={{ width: '100px' }}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
