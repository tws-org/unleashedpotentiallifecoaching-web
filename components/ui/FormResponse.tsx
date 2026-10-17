import { motion } from 'framer-motion';
import React from 'react';

interface Props {
  message: string;
}

const FormResponse = ({ message }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="mx-auto my-8 border-2 px-6 py-3 flex flex-col align-center justify-center"
    >
      <p className="text-xl font-serif text-center">{message}</p>
    </motion.div>
  );
};

export default FormResponse;
