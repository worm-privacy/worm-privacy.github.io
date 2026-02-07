'use client';

import { useIsMobile } from '@/hooks';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { PropsWithChildren, useCallback, useLayoutEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

function SmoothScroll({ children, slideUpOnLoad = false }: PropsWithChildren & { slideUpOnLoad: boolean }) {
  const scrollRef = useRef(null);
  const isMobile = useIsMobile();

  const [pageHeight, setPageHeight] = useState(0);

  const resizePageHeight = useCallback((entries: any) => {
    for (let entry of entries) {
      setPageHeight(entry.contentRect.height);
    }
  }, []);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => resizePageHeight(entries));
    if (scrollRef.current) resizeObserver.observe(scrollRef.current);
    return () => resizeObserver.disconnect();
  }, [scrollRef, resizePageHeight]);

  const { scrollY } = useScroll();
  const transform = useTransform(scrollY, [0, pageHeight], [0, -pageHeight]);
  const physics = { damping: 20, mass: 0.27, stiffness: 200 };
  const spring = useSpring(transform, physics);

  return isMobile ? (
    <motion.div
      initial={{ opacity: 0, y: slideUpOnLoad ? '100vh' : 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
        mass: 1,
      }}
      className="relative w-full will-change-transform"
    >
      {children}
    </motion.div>
  ) : (
    <>
      <motion.div
        ref={scrollRef}
        initial={{ top: slideUpOnLoad ? '100%' : '0%', opacity: 0 }}
        animate={{ top: '0%', opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          mass: 1,
        }}
        style={{ y: spring }}
        className="fixed left-0 w-full overflow-hidden will-change-transform"
      >
        {children}
      </motion.div>
      <div style={{ height: pageHeight }} />
    </>
  );
}

export { SmoothScroll };
