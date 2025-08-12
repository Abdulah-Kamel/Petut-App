import React, { Fragment, useState } from 'react';
import logo from '../../assets/petut.png';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { collection, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.js';
import axios from 'axios';
import { Modal } from "bootstrap";

export default function EditProductModal({ product, setProducts, modalId, onProductUpdate }) {
    const {
        productName: defaultName,
        description: defaultDescription,
        rate: defaultRate,
        price: defaultPrice,
        weight: defaultWeight,
        category: defaultCategory,
        imageURL: defaultImageUrl,
    } = product;

    const [productName, setProductName] = useState(defaultName);
    const [description, setDescription] = useState(defaultDescription);
    const [rate, setRate] = useState(defaultRate);
    const [price, setPrice] = useState(defaultPrice);
    const [weight, setWeight] = useState(defaultWeight);
    const [category, setCategory] = useState(defaultCategory);
    const [imageURL, setImageUrl] = useState(defaultImageUrl);
    const [notEditable, setNotEditable] = useState(true);
    const [loading, setLoading] = useState(false);

    // update product to firebase 
    const handelUpdateProduct = async () => {
        setLoading(true);
        // setNotEditable(true);

        let url = imageURL;

        if (typeof imageURL !== 'string') {
            try {
                const formData = new FormData();
                formData.append('image', imageURL);
                const response = await axios.post(
                    'https://api.imgbb.com/1/upload?key=da1538fed0bcb5a7c0c1273fc4209307',
                    formData
                );
                url = response.data.data.url;
            } catch (error) {
                setLoading(false);
                toast.error('Image upload failed: ' + error.message, { autoClose: 3000 });
                return;
            }
        }

        try {
            const productsRef = collection(db, 'products');
            await updateDoc(doc(productsRef, modalId), {
                productName,
                description,
                rate,
                price,
                weight,
                category,
                imageURL: url,
            });
            if (onProductUpdate) {
                onProductUpdate({
                    id: modalId,
                    productName,
                    description,
                    rate,
                    price,
                    weight,
                    category,
                    imageURL: url,
                });
            }
            toast.success('Product updated successfully', { autoClose: 3000 });
            setNotEditable(true);
            document.getElementById('close-btn-modal').click();
            setProducts(products => [...products, {
                productName,
                description,
                price,
                weight,
                rate,
                category,
                imageURL: url,
                createdAt: Timestamp.now()
            }]);

        } catch (error) {
            toast.error('Failed to update product: ' + error.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const resetFields = () => {
        setProductName(defaultName);
        setDescription(defaultDescription);
        setRate(defaultRate);
        setPrice(defaultPrice);
        setWeight(defaultWeight);
        setCategory(defaultCategory);
        setImageUrl(defaultImageUrl);
    };

    return (
        <Fragment>
            <div
                className="modal fade "
                style={{ paddingTop: '70px' }}
                id={`editproduct-${modalId}`}
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex={-1}
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content px-2">
                        <div className="modal-header py-0 d-flex align-items-center justify-content-between">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">
                                Product Info
                            </h1>
                            <img src={logo} width={'90px'} height={'90px'} alt="" />
                        </div>
                        <div className="modal-body">
                            <form action="#">
                                <div className="product-name d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="product-name" className="form-label">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control w-75"
                                        id="product-name"
                                        placeholder="Enter Product Name"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        disabled={notEditable}
                                    />
                                </div>
                                <div className="product-description d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="product-description" className="form-label">
                                        Description
                                    </label>
                                    <textarea
                                        className="form-control w-75"
                                        id="product-description"
                                        placeholder="Enter Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={notEditable}
                                    />
                                </div>

                                <div className="product-price d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="product-price" className="form-label">
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control w-75"
                                        id="product-price"
                                        placeholder="Enter Price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        disabled={notEditable}
                                    />
                                </div>
                                <div className="product-weight d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="product-weight" className="form-label">
                                        Weight
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control w-75"
                                        id="product-weight"
                                        placeholder="Enter Weight"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        disabled={notEditable}
                                        optional
                                    />
                                </div>

                                <div className="product-image d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="product-image" className="form-label">
                                        Image
                                    </label>
                                    {notEditable ? (
                                        <div className="form-control w-75 d-flex align-items-center">
                                            <img src={imageURL} alt="Product" style={{ maxWidth: "180px" }} />
                                        </div>
                                    ) : (
                                        <input
                                            type="file"
                                            className="form-control w-75"
                                            id="product-image"
                                            accept="image/*"
                                            onChange={(e) => setImageUrl(e.target.files[0])}
                                        />
                                    )}
                                </div>
                                <div className="product-rate d-flex align-items-center gap-3 mb-3">
                                    <label htmlFor="product-rate" className="form-label">
                                        Rating
                                    </label>
                                    <select className="form-select w-50" id="product-rate" aria-label="Default select example" value={rate} onChange={(e) => setRate(e.target.value)} disabled={notEditable}>
                                        <option value="" >Choose</option>
                                        <option value="1">1</option>
                                        <option value="1.5">1.5</option>
                                        <option value="2">2</option>
                                        <option value="2.5">2.5</option>
                                        <option value="3">3</option>
                                        <option value="3.5">3.5</option>
                                        <option value="4">4</option>
                                        <option value="4.5">4.5</option>
                                        <option value="5">5</option>
                                    </select>

                                </div>
                                <div className="product-category">
                                    <label htmlFor="product-category" className="form-label">
                                        Category
                                    </label>
                                    <select
                                        className="form-select w-75"
                                        id="product-category"
                                        aria-label="Default select example"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        disabled={notEditable}
                                    >
                                        <option value="">Open this select menu</option>
                                        <option value="cat">Cat</option>
                                        <option value="dog">Dog</option>
                                        <option value="bird">Bird</option>
                                        <option value="toys">Toyes</option>

                                    </select>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer d-flex gap-3">

                            {notEditable ? (
                                <>
                                    <button type="button" className="custom-button w-25 text-white bg-danger" id="close-btn-modal" data-bs-dismiss="modal" aria-label="Close">Close</button>
                                    <button type="button" className="custom-button w-25" onClick={() => setNotEditable(false)}>Edit Product</button>
                                </>
                            ) : (
                                <div className="d-flex gap-3 w-100 justify-content-end">
                                    <button type="button" className="btn text-white bg-danger w-25 " onClick={() => {

                                        resetFields();
                                        setNotEditable(true);
                                    }
                                    } >Cancel</button>
                                    <button type="button" className="custom-button w-25 d-flex align-items-center justify-content-center" onClick={handelUpdateProduct} disabled={notEditable || loading}>{loading ? <BeatLoader size={10} color="#fff" /> : "Edit Product"} </button>
                                </div>

                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
