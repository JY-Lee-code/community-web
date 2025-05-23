import React from 'react';

const Input = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border rounded p-2 w-full"
    />
  );
};

export default Input;
