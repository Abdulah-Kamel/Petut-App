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

const ContactInfoForm = ({ deliveryInfo, handleChange, errors }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg dark:text-white font-semibold mb-4">Contact Information</h2>
      <div className="space-y-4">
        <FormInput
          id="fullName"
          name="fullName"
          label="Full Name"
          value={deliveryInfo.fullName}
          onChange={handleChange}
          error={errors.fullName}
          placeholder="John Doe"
        />
        <FormInput
          id="phone"
          name="phone"
          label="Phone Number"
          type="tel"
          value={deliveryInfo.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="+1 (555) 123-4567"
        />
        <FormInput
          id="email"
          name="email"
          label="Email Address"
          type="email"
          value={deliveryInfo.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="john.doe@example.com"
        />
      </div>
    </div>
  );
};

export default ContactInfoForm;
