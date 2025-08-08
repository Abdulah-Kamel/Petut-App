import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeliveryHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 bg-white rounded-xl p-4 dark:bg-[#313340] shadow-md z-10 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="text-neutral dark:text-white hover:text-primary_app dark:hover:text-primary_app transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl dark:text-white font-bold">Delivery Information</h1>
        <div className="w-6"></div> {/* Empty div for flex spacing */}
      </div>
    </div>
  );
};

export default DeliveryHeader;
