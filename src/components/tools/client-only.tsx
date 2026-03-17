'use client';

import { useEffect, useState } from 'react';

export const ClientOnlyWrapper = (props: { children?: React.ReactNode; enabled: boolean }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (props.enabled && !mounted) return null;
  return props.children;
};
