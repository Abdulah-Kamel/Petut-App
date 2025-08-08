import React from 'react';

const FormInput = ({ id, name, label, value, onChange, error, type = 'text', placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} dark:border-gray-500 dark:bg-[#313340] dark:text-white dark:placeholder:text-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary_app`}
      placeholder={placeholder}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const AddressForm = ({ deliveryInfo, handleChange, errors }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg dark:text-white font-semibold mb-4">Delivery Address</h2>
      <div className="space-y-4">
        <FormInput
          id="address"
          name="address"
          label="Street Address"
          value={deliveryInfo.address}
          onChange={handleChange}
          error={errors.address}
          placeholder="123 Main St, Apt 4B"
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            id="city"
            name="city"
            label="City"
            value={deliveryInfo.city}
            onChange={handleChange}
            error={errors.city}
            placeholder="New York"
          />
          <FormInput
            id="postalCode"
            name="postalCode"
            label="Postal Code"
            value={deliveryInfo.postalCode}
            onChange={handleChange}
            error={errors.postalCode}
            placeholder="10001"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
