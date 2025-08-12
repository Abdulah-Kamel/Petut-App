import React, { Fragment, useEffect, useState } from 'react'
import { RiAddLine } from "react-icons/ri";
import AddProductModal from '../../components/admindash/AddProductModal';
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
import ProductsTable from './../../components/admindash/ProductsTable';
import logo from '../../assets/petut.png';
import OrdersTable from '../../components/admindash/OrdersTable.jsx';




export default function Store() {
    const [products, setProducts] = useState([]);
    const [productLoading, setProductLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [orderLoading, setOrderLoading] = useState(true);



    //get products from firebase
    useEffect(() => {
        const fetchProducts = async () => {
            setProductLoading(true);
            try {

                const productsRef = collection(db, 'products');
                const q = query(productsRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProducts(productsData);
            } catch (error) {
                toast.error("Failed to fetch products, error:" + error.message, { autoClose: 3000 });
            } finally {
                setProductLoading(false);
            }
        }
        fetchProducts();
    }, [])



    // //get orders from firebase
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersRef = collection(db, 'orders');
                const q = query(ordersRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const ordersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOrders(ordersData);
            } catch (error) {
                toast.error("Failed to fetch products, error:" + error.message, { autoClose: 3000 });
            } finally {
                setOrderLoading(false);
            }
        }
        fetchOrders();
    }, [])




    //delete product from firebase
    const handleDeleteProduct = async (id) => {
        try {
            await deleteDoc(doc(db, "products", id));
            toast.success("Product deleted successfully", { autoClose: 3000 });
            setProducts(products => products.filter(product => product.id !== id));
            setProductLoading(true);

        } catch (error) {
            toast.error("Failed to delete product, error:" + error.message, { autoClose: 3000 });
        }finally {
            setProductLoading(false);
        }
    }
    //delete order from firebase
    const handleDeleteOrder = async (id) => {
        try {
            await deleteDoc(doc(db, "orders", id));
            toast.success("Order deleted successfully", { autoClose: 3000 });
            setOrders(orders => orders.filter(order => order.id !== id));
            setOrderLoading(true);

        } catch (error) {
            toast.error("Failed to delete order, error:" + error.message, { autoClose: 3000 });
        }
    }



    return (
        <Fragment>

            <div className="head d-flex align-items-center justify-content-between">
                <div className="left">
                    <h1>Orders</h1>
                    <p>Managing all Orders will be done in the store page </p>
                </div>
                <div className="right">
                    <img src={logo} width={'100px'} height={'100px'} alt="logo" />
                </div>
            </div>
            {orderLoading ? (<h3 className='text-center mt-5'><BeatLoader color='#D9A741' /></h3>) : orders.length === 0 ? <h3 className='text-center mt-5'>No orders found</h3> : (
                <>
                    <OrdersTable orders={orders} setOrders={setOrders} handleDeleteOrder={handleDeleteOrder} loading={orderLoading} setLoading={setOrderLoading} />
                </>
            )}

            <hr />
            <div className="left">
                <h1>Products</h1>
                <p>Managing all Products will be done in the store page </p>

            </div>
            <div className='d-flex align-items-center justify-content-end mt-4' >
                <button className='custom-button d-flex align-items-center fw-bold' data-bs-toggle="modal" data-bs-target="#addproduct" > <RiAddLine size={20} /> Add Product</button>
            </div>
            <AddProductModal products={products} setProducts={setProducts} loading={productLoading} setLoading={setProductLoading}  />
            {productLoading ? (<h3 className='text-center mt-5'><BeatLoader color='#D9A741' /></h3>) : products?.length === 0 ? <h3 className='text-center my-5'>No Products found</h3> : (

                <>
                    <ProductsTable products={products} setProducts={setProducts} handleDeleteProduct={handleDeleteProduct} loading={productLoading} setLoading={setProductLoading} />
                </>
            )}

        </Fragment>
    )
}
