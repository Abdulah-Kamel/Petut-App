import React from 'react';

const PaymentOrderSummary = ({ totalAmount }) => {
  return (
    <div className="bg-white dark:bg-[#313340] rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <h3 className="font-semibold dark:text-white mb-4">Order Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-white">Total Amount</span>
          <span className="font-bold dark:text-white">{totalAmount.toFixed(2)} €</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-500 pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span className="dark:text-white">Amount to Pay</span>
            <span className="font-bold dark:text-white">{totalAmount.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOrderSummary;
