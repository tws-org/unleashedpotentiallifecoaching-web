import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

const SharedToastContainer = () => {
  const [position, setPosition] = useState<'top-center' | 'top-right'>(
    'top-right',
  );

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setPosition('top-center');
    } else {
      setPosition('top-right');
    }
  }, []);

  return (
    <ToastContainer
      position={position}
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default SharedToastContainer;
