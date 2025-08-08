import React from 'react';

const DeliveryTimeSelector = ({ deliveryTimes, selectedTime, handleChange }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg dark:text-white font-semibold mb-4">Preferred Delivery Time</h2>
      <div className="grid grid-cols-2 gap-3">
        {deliveryTimes.map(time => (
          <label
            key={time.id}
            className={`block p-3 border rounded-lg cursor-pointer text-center transition-colors ${selectedTime === time.id ? 'border-primary_app bg-primary_app/5 dark:bg-primary_app/100 dark:text-white' : 'border-gray-200 hover:bg-primary_app dark:hover:bg-gray-600'} bg-white dark:border-gray-700  dark:bg-[#313340] dark:text-white dark:hover:text-white`}
          >
            <input
              type="radio"
              name="deliveryTime"
              value={time.id}
              checked={selectedTime === time.id}
              onChange={handleChange}
              className="sr-only"
            />
            <span className="text-sm font-medium">{time.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default DeliveryTimeSelector;
