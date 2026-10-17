import React from 'react';
import { AiOutlineFacebook, AiOutlineInstagram } from 'react-icons/ai';

const CONTACT_INFO = [
  'Jessica: (631) 432-8897',
  'Unleashedpotentiallifecoaching@gmail.com',
];

const ContactInfo = () => (
  <div className="w-100 sm:w-1/2 my-12 mx-12 sm:mx-0">
    {CONTACT_INFO.map((person, index) => (
      <p
        className="text-forrest break-words sm:break-normal text-xl sm:text-2xl"
        key={`${person}-${index}`}
      >
        {person}
      </p>
    ))}
    <div className="my-3 flex flex-row">
      <a
        href="https://www.facebook.com/unleashedpotentiallifecoaching/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <AiOutlineFacebook size={50} className="text-forrest" />
        <span className="sr-only">Facebook</span>
      </a>
      <a
        href="https://www.instagram.com/unleashedpotentiallifecoaching/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <AiOutlineInstagram size={50} className="text-forrest" />
        <span className="sr-only">Instagram</span>
      </a>
    </div>
  </div>
);

export default ContactInfo;
