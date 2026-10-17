import React from 'react';

interface Props {
  id: string;
  label: string;
  type: string;
  name: string;
  placeHolder?: string;
}

const InputText = ({ id, label, type, name, placeHolder }: Props) => {
  return (
    <>
      <label htmlFor={id} className="block text-lg font-medium">
        <span className="sr-only">{label}</span>
        {type !== 'textarea' ? (
          <input
            type={type}
            name={name}
            id={id}
            aria-label={id}
            placeholder={placeHolder || label}
            className="block w-full font-bold outline-0 border-0  focus:outline-0  p-3 rounded text-xl text-forrest-900 bg-cream-200"
          />
        ) : (
          <textarea
            name={name}
            id={id}
            aria-label={id}
            placeholder={label}
            style={{ minHeight: '200px' }}
            className="block w-full font-bold outline-0 border-0  focus:outline-0  p-3 rounded text-xl text-forrest-900 bg-cream-200"
          />
        )}
      </label>
    </>
  );
};

export default InputText;
