import React, { Fragment, useState } from 'react'
import { FaEye } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import ConfirmModal from '../ConfirmModal';
import ViewOrderModal from './ViewOrderModal';

export default function OrdersTable({ orders, handleDeleteOrder, loading }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // // filter orders 
  // const filterOreders = orders?.filter(order => {
  //     const nameMatch = order?.orderName?.toLowerCase().includes(searchTerm.toLowerCase());
  //     const priceMatch = String(order?.price).includes(searchTerm);
  //     const categoryMatch = categoryFilter === 'all' || order.category === categoryFilter;
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

        <div className="orders-table mt-4 mb-5  bg-white shadow rounded w-100 " style={{ maxHeight: '620px', overflowY: 'auto' }}>
          <table className="table">
            <thead className="table-light py-3">
              <tr className="">
                <th className="px-4 py-3 align-middle">Customer Name</th>
                <th className="px-4 py-3 align-middle">Phone</th>
                <th className="px-4 py-3 align-middle">Date</th>
                <th className="px-4 py-3 align-middle">Time</th>
                <th className="px-4 py-3 align-middle">Total</th>
                <th className="px-4 py-3 align-middle">Status</th>
                <th className="px-4 py-3 align-middle">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="px-4 py-3 align-middle">{order.deliveryInfo.fullName}</td>
                  <td className="px-4 py-3 align-middle">{order.deliveryInfo.phone}</td>
                  <td className="px-4 py-3 align-middle">{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-GB') : ''}</td>
                  <td className="px-4 py-3 align-middle">{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleTimeString() : ''}</td>
                  <td className="px-4 py-3 align-middle">{order.cart.totalAmount} EGP</td>
                  <td className="px-4 py-3 align-middle">
                    <select name="status" id="status" className='cursor-pointer border-1 rounded-1'>
                      <option value="pending">{order.paymentInfo.status}</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 align-middle ">
                    <button type="button" className="btn border-0 p-0 me-1" data-bs-toggle="modal" data-bs-target={`#vieworder-${order.id}`}>
                      <FaEye />
                    </button>
                    <ViewOrderModal order={order} modalId={order.id} orders={orders} />
                    <button type="button" className="btn border-0 p-0 " onClick={() => {
                      setShowConfirm(true);
                      setSelectedOrderId(order.id);
                    }} >
                      <MdDelete size={20} className='text-danger' />
                    </button>

                  </td>
                </tr>
              ))}

            </tbody>
          </table>
          {showConfirm && (<ConfirmModal onDelete={() => handleDeleteOrder(selectedOrderId)} setShowConfirm={setShowConfirm} selectedId={selectedOrderId} whatDelete="order" />)}

        </div>
      )}

    </Fragment>
  )
}


