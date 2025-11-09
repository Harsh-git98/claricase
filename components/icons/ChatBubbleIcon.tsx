import React from 'react';

export const ChatBubbleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    {...props}
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth="1.5" 
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.125 1.125 0 01-1.59 0l-3.72-3.72a1.125 1.125 0 01-1.59 0l-3.72 3.72a1.125 1.125 0 01-1.59 0l-3.72-3.72A1.993 1.993 0 012.25 15v-4.286c0-.97.616-1.813 1.5-2.097m16.5 0a9 9 0 00-16.5 0m16.5 0v.003m0 0l-1.125 5.625M3.75 8.511v.003m0 0l1.125 5.625m0 0l3.72-3.72a1.125 1.125 0 011.59 0l3.72 3.72a1.125 1.125 0 011.59 0l3.72-3.72 1.125-5.625" />
  </svg>
);