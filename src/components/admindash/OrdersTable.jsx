import React, { Fragment } from 'react'

export default function OrdersTable({ orders, loading }) {


    // // filter orders 
    // const filterProducts = orders?.filter(order => {
    //     const nameMatch = order?.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    //     const priceMatch = String(product?.price).includes(searchTerm);
    //     const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter;
    //     return (nameMatch || priceMatch) && categoryMatch;
    // })
    return (
        <Fragment>
            {/* <div className="d-flex justify-content-between align-items-center my-3">
                <div className="search-box position-relative" style={{ width: '40%' }}>
                    <input
                        className="form-control pe-5"
                        type="text"
                        placeholder="Search by name, Price"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <BiSearchAlt2
                        size={20}
                        className="position-absolute"
                        style={{ top: '50%', right: '15px', transform: 'translateY(-50%)', color: '#888' }}
                    />
                </div>
                <select className="form-select w-25" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} >
                    <option value="all" >All</option>
                    <option value="cat" >Cat</option>
                    <option value="dog" >Dog</option>
                    <option value="toys" >Toys</option>
                </select>
            </div> */}

            {loading ? <h3 className='text-center mt-5'><BeatLoader color='#D9A741' /></h3> : orders.length === 0 ? <h3 className='text-center mt-5'>No orders found</h3> : (

                <div className="orders-table mt-4 mb-5  bg-white shadow rounded w-100 ">
                    <table className="table">
                        <thead className="table-light py-3">
                            <tr className="">
                                <th className="px-4 py-3">Customer Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>
                                        <ul className="mb-0">
                                            {order.products.map((prod, i) => (
                                                <li key={i}>{prod.price}  x {prod.quantity}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>{order.customerName}</td>
                                    <td>{order.phone}</td>
                                    <td>{order.address}</td>
                                    <td>{order.total} EGP</td>
                                    <td>{order.status}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>

                </div>
            )}

        </Fragment>
    )
}
