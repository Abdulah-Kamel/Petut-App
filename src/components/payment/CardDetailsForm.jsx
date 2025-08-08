import React from 'react';

const FormInput = ({ id, name, label, value, onChange, error, type = 'text', placeholder, maxLength }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-white mb-1">{label}</label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} dark:border-gray-500 dark:bg-[#313340] dark:text-white dark:placeholder:text-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary_app`}
      maxLength={maxLength}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const CardDetailsForm = ({ paymentInfo, errors, handleChange, handleCardNumberChange, handleExpiryDateChange }) => {
  if (paymentInfo.paymentMethod !== 'card') return null;

  return (
    <div className="mb-6 bg-white dark:bg-[#313340] rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg dark:text-white font-semibold mb-4">Card Details</h2>
      <div className="space-y-4">
        <FormInput
          id="cardNumber"
          name="cardNumber"
          label="Card Number"
          value={paymentInfo.cardNumber}
          onChange={handleCardNumberChange}
          placeholder="1234 5678 9012 3456"
          error={errors.cardNumber}
          maxLength="19"
        />
        <FormInput
          id="cardHolder"
          name="cardHolder"
          label="Cardholder Name"
          value={paymentInfo.cardHolder}
          onChange={handleChange}
          placeholder="John Doe"
          error={errors.cardHolder}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            id="expiryDate"
            name="expiryDate"
            label="Expiry Date"
            value={paymentInfo.expiryDate}
            onChange={handleExpiryDateChange}
            placeholder="MM/YY"
            error={errors.expiryDate}
            maxLength="5"
          />
          <FormInput
            id="cvv"
            name="cvv"
            label="CVV"
            type="password"
            value={paymentInfo.cvv}
            onChange={handleChange}
            placeholder="123"
            error={errors.cvv}
            maxLength="4"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="saveCard"
            name="saveCard"
            checked={paymentInfo.saveCard}
            onChange={handleChange}
            className="h-4 w-4 text-primary_app focus:ring-primary_app rounded"
          />
          <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Save this card for future payments
          </label>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsForm;
