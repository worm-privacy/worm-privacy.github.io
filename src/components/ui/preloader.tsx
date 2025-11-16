'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { useScrollLock } from '@/hooks';

export function Preloader() {
  useScrollLock({ autoLock: true });

  document.addEventListener('load', (event) => {
    console.log('page is fully loaded');
  });

  function renderWorm() {
    const x = 23.8937;

    return (
      <motion.g
        key={`moving-worm`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        transform={`translate(${x}, 22)`}
      >
        <path
          d="M13.4124 1.74387C12.2969 0.628307 10.771 0 9.2002 0H5.85032C4.23147 0 2.76967 0.660364 1.71501 1.71502C0.660354 2.76968 0 4.23145 0 5.83427C0 9.05594 2.60939 11.6653 5.83106 11.6653H6.03623C7.498 11.6653 8.91168 12.2456 9.9503 13.2842L13.9446 17.2784C14.8261 18.1439 15.8455 18.8332 16.9643 19.2916C18.0798 19.7468 19.2916 20 20.5161 20C22.3562 20 24.1481 19.4486 25.674 18.4421L28.3314 16.6661L13.4124 1.74707V1.74387ZM5.85032 8.11348C4.46868 8.11348 3.3499 6.99471 3.3499 5.61308C3.3499 4.23145 4.46868 3.11268 5.85032 3.11268C7.23195 3.11268 8.35069 4.23145 8.35069 5.61308C8.35069 6.99471 7.23195 8.11348 5.85032 8.11348Z"
          fill="#00C871"
        />
        <path
          d="M18.332 3.33387L31.5841 16.586C33.7704 18.7722 36.71 19.9808 39.7906 19.9808C42.0858 19.9808 44.317 19.3044 46.2372 18.0317L48.3112 16.6469L35.0591 3.39478C32.8728 1.22456 29.9172 0 26.8526 0C24.5574 0 22.3263 0.676391 20.4061 1.94903L18.332 3.33387Z"
          fill="#00C871"
        />
        <path
          d="M38.6758 3.11338L50.3411 15.298L60.3555 8.11418L55.499 3.39868C53.2679 1.22846 50.2642 0.00390625 47.1355 0.00390625C44.8883 0.00390625 42.67 0.632208 40.7691 1.82791L38.695 3.11658H38.679L38.6758 3.11338Z"
          fill="#00C871"
        />
      </motion.g>
    );
  }

  return (
    <AnimatePresence>
      {true ? (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            mass: 1,
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          <div className="flex flex-col items-center gap-8">
            <svg width={35 * (23.8937 + 2)} height="60" viewBox={`0 0 ${35 * (23.8937 + 2)} 60`} className="max-w-full">
              {Array.from({ length: 35 }).map((_, index) => {
                const x = index * 23.8937; // path width + 2px spacing

                return (
                  <g key={index} transform={`translate(${x}, 22)`}>
                    <path
                      d="M0 2.66667L10.5623 13.2704C12.3039 15.0189 14.6469 15.9874 17.1027 15.9874C18.932 15.9874 20.7112 15.4465 22.2398 14.4277L23.8937 13.3208L13.3313 2.71698C11.5897 0.981132 9.2342 0 6.79096 0C4.96166 0 3.18248 0.54088 1.65389 1.55975L0 2.66667Z"
                      fill="rgba(0, 200, 113, 0.2)"
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth="0.5"
                    />
                  </g>
                );
              })}

              {renderWorm()}
            </svg>

            {/* <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
            className="flex w-[5ch] items-center justify-between font-orbitron text-base font-bold text-white tabular-nums"
          >
            {(progress * 100).toFixed(0)}%
          </motion.div> */}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
