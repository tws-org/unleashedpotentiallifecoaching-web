import { motion } from 'framer-motion';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const FadeInContainer = ({ children }: Props) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.2 }}
  >
    {children}
  </motion.div>
);

export default FadeInContainer;
