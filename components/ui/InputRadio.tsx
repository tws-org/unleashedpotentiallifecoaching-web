import React from 'react';

interface Props {
  title: string;
  label: string;
  options: {
    name: string;
    checked: boolean;
  }[];
}

const RadioInput = ({ title, label, options }: Props) => {
  return (
    <div className="my-6">
      <p className="text-forrest text-xl font-bold">{title}</p>
      {options.map(({ name, checked }, index) => (
        <label className="block my-4" htmlFor={name} key={`${name}-${index}`}>
          <input
            aria-label={name}
            value={name}
            name={label}
            id={label}
            type="radio"
            defaultChecked={checked}
          />
          <span className="ml-3">{name}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioInput;
