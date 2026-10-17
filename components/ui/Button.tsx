import React from 'react';

interface Props {
  label: string;
  disabled: boolean;
}
const Button = ({ label, disabled }: Props) => (
  <button
    type="submit"
    disabled={disabled}
    className="bg-forrest-900 hover:bg-forrest  text-white text-center py-4 px-12 text-xl rounded"
  >
    {label}
  </button>
);

export default Button;
