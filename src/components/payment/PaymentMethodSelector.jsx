import React from 'react';

const PaymentMethodSelector = ({ paymentMethods, selectedMethod, handleChange }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg dark:text-white font-semibold mb-4">Payment Method</h2>
      <div className="space-y-3">
        {paymentMethods.map(method => (
          <label 
            key={method.id}
            className={`block p-4 border rounded-lg cursor-pointer transition-colors ${selectedMethod === method.id ? 'border-primary bg-primary_app' : 'border-gray-200 hover:bg-primary_app hover:text-white'} bg-white dark:border-gray-700 dark:hover:bg-gray-600 dark:bg-[#313340] dark:text-white dark:hover:text-white`}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={handleChange}
                className="h-5 w-5 text-primary_app focus:ring-primary_app"
              />
              <div className="ml-3">
                <span className="font-medium">{method.name}</span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
