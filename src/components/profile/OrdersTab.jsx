import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import LoadingAnimation from "../common/LoadingAnimation.jsx";

const OrdersTab = ({ orders, loading, error }) => {
  const navigate = useNavigate();

  if (loading) {
    return <LoadingAnimation />
  }
  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white dark:bg-[#313340] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-2xl dark:text-white font-bold mb-6">My Orders</h2>
      {!orders || orders.length === 0 ? (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h3 className="text-xl dark:text-white font-semibold mb-2">No orders yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You haven't placed any orders yet.
          </p>
          <button
            onClick={() => navigate("/catalog")}
            className="px-6 py-3 bg-primary_app text-white font-semibold rounded-lg hover:bg-primary_app/90 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 dark:border-gray-500 rounded-lg overflow-hidden"
            >
              <div className="bg-gray-50 dark:bg-secondary-dark p-4 flex flex-wrap max-md:flex-col max-md:items-start justify-between items-center">
                <div>
                  <span className="text-sm text-gray-600 dark:text-white">Order ID:</span>
                  <span className="ml-2 font-mono font-medium dark:text-gray-400">{order.id}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-white">Date:</span>
                  <span className="ml-2 dark:text-gray-400">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-white">Status:</span>
                  <span
                    className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-white">Total:</span>
                  <span className="ml-2 font-semibold dark:text-white">
                    {order.cart?.totalAmount?.toFixed(2) || "0.00"} €
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-3 dark:text-white">Items</h3>
                <div className="space-y-3">
                  {order.cart?.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <img
                        src={item.imageURL}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex items-center">
                        <span className="font-medium dark:text-white">{item.productName}</span>
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                          x{item.quantity}
                        </span>
                      </div>
                      <span className="font-semibold dark:text-white">{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-secondary-dark p-4 flex justify-end space-x-4">
                <Link
                  to={`/order/${order.id}`}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white transition-colors"
                >
                  View Details
                </Link>
                {/* <button className="px-4 py-2 bg-primary_app text-white rounded-lg hover:bg-primary_app/90 transition-colors">
                  Track Order
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
