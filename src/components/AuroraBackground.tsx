'use client';

import dynamic from 'next/dynamic';

const Aurora = dynamic(() => import('@/components/Aurora'), { ssr: false });

export default function AuroraBackground() {
  return (
    <Aurora
      colorStops={["#7cff67","#B19EEF","#5227FF"]}
      blend={0.5}
      amplitude={1.0}
      speed={1}
    />
  );
}
