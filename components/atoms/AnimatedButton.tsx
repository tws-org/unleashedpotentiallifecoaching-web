import { LazyMotion, domAnimation, m, useInView } from 'framer-motion';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';

const AnimatedButton = ({
  children,
}: {
  children: React.ReactElement[] | React.ReactElement;
}) => {
  const [backgroundColor, setBackgroundColor] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 1 });

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
        transition={{ duration: 2 }}
      >
        {/* A styled wrapper, not a <button>: the link inside is the control,
            and a link nested in a button is invalid and confuses screen readers. */}
        <div
          onMouseDown={() => setBackgroundColor(true)}
          onMouseUp={() => setBackgroundColor(false)}
          onMouseLeave={() => setBackgroundColor(false)}
          className={classNames(
            'px-4 py-4 bg-black text-white font-semibold shadow-lg bg-black bg-opacity-50',
            {
              'shadow-xl': backgroundColor,
            },
          )}
        >
          <div className="border py-4 px-6">{children}</div>
        </div>
      </m.div>
    </LazyMotion>
  );
};

export default AnimatedButton;
