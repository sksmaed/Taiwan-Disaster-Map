
import React from 'react';

export const LayersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5L2.25 9l9.75 4.5 9.75-4.5L12 4.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l9.75 4.5 9.75-4.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15l9.75 4.5 9.75-4.5" />
  </svg>
);
