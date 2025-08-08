import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserOrders } from '../store/slices/orderSlice';
import { useAuth } from '../context/AuthContext';
import LoadingAnimation from "../components/common/LoadingAnimation.jsx";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { orders, loading, error } = useSelector(state => state.orders);
  const order = orders.find(o => o.id === orderId);

  useEffect(() => {
    if (currentUser && !order && !loading) {
      dispatch(fetchUserOrders(currentUser.uid));
    }
  }, [currentUser, order, loading, dispatch]);

  if (loading) {
    return <LoadingAnimation />
  }
  if (error) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-red-500">{error}</div>;
  }
  if (!order) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center">Order not found.</div>;
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const { deliveryInfo, cart, paymentInfo, createdAt, status } = order;
  const deliveryDate = new Date(createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-12">
      <button onClick={() => navigate(-1)} className="mb-4 text-primary_app hover:underline">&larr; Back to Orders</button>
      <div className="bg-white dark:bg-[#313340] rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Order #{order.id}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold dark:text-white mb-2">Order Info</h2>
            <div className="mb-2 dark:text-white"><span>Order Date:</span> {formatDate(createdAt)}</div>
            <div className="mb-2  dark:text-white"><span>Status:</span> {status}</div>
            <div className="mb-2  dark:text-white"><span>Estimated Delivery:</span> {formatDate(deliveryDate)}</div>
          </div>
          <div>
            <h2 className="font-semibold dark:text-white mb-2">Shipping Info</h2>
            <div className="mb-2  dark:text-white"><span>Name:</span> {deliveryInfo?.fullName}</div>
            <div className="mb-2  dark:text-white"><span>Address:</span> {deliveryInfo?.address}, {deliveryInfo?.city}, {deliveryInfo?.postalCode}</div>
            <div className="mb-2  dark:text-white"><span>Phone:</span> {deliveryInfo?.phone}</div>
            <div className="mb-2  dark:text-white"><span>Email:</span> {deliveryInfo?.email}</div>
            <div className="mb-2  dark:text-white"><span>Delivery Method:</span> {deliveryInfo?.deliveryMethod}</div>
            <div className="mb-2  dark:text-white"><span>Delivery Time:</span> {deliveryInfo?.deliveryTime}</div>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-[#313340] rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Order Items</h2>
        <div className="space-y-4 mb-6">
          {cart?.items?.map((item) => (
            <div key={item.id} className="flex items-center pb-4 border-b border-gray-200 border-gray-500 last:border-b-0">
              <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden mr-4">
                {item.imageURL ? (
                  <img src={item.imageURL} alt={item.productName} className="w-full h-full object-cover dark:text-white" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-white">No Image</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium dark:text-white">{item.productName}</h3>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-200">Qty: {item.quantity}</span>
                  <span className="font-medium dark:text-white">{item.totalPrice?.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-500 pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-white">Subtotal</span>
            <span className="font-medium dark:text-white">{cart?.totalAmount?.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-white">Shipping</span>
            <span className="font-medium dark:text-white">{deliveryInfo?.deliveryMethod === 'express' ? '9.99 €' : 'Free'}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-500">
            <span className="text-gray-600 dark:text-white">Total</span>
            <span className="font-medium dark:text-white">{cart?.totalAmount?.toFixed(2)} €</span>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-[#313340] rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Payment Info</h2>
        <div className="mb-2 dark:text-white"><span>Payment Method:</span> {paymentInfo?.paymentMethod}</div>
        <div className="mb-2 dark:text-white"><span>Cardholder:</span> {paymentInfo?.cardHolder}</div>
      </div>
      <div className="text-center space-y-4">
        <Link to="/profile" className="inline-block py-3 px-6 bg-primary_app text-white font-semibold rounded-lg hover:bg-primary_app/90 transition-colors">Back to Orders</Link>
      </div>
    </div>
  );
};

export default OrderDetailsPage; 