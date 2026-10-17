import { useEffect, useState } from 'react';

const usePagination = (
  total: number,
  currentLimit: number,
  setCurrentLimit: (e: number) => void,
) => {
  const [disableBtn, setDisableBtn] = useState(true);

  const handleAmountChange = () => {
    try {
      if (total !== currentLimit) {
        let updateLimit = currentLimit + 1;
        setCurrentLimit(updateLimit);
      } else {
        setDisableBtn(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (total) {
      if (total > 4) {
        setDisableBtn(false);
      }
    }
  }, [total, setDisableBtn]);

  return [disableBtn, handleAmountChange] as const;
};

export default usePagination;
