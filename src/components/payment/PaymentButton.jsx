import React from 'react';

const PaymentButton = ({ isProcessing, totalAmount }) => {
  return (
    <button 
      type="submit"
      disabled={isProcessing}
      className="w-full py-3 bg-primary_app text-white font-semibold rounded-lg hover:bg-primary_app/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isProcessing ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing Payment...
        </span>
      ) : (
        `Pay ${totalAmount.toFixed(2)} €`
      )}
    </button>
  );
};

export default PaymentButton;
