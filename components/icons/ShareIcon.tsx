import React from 'react';

export const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        {...props}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 8.25a4.5 4.5 0 01-4.5 4.5H9a4.5 4.5 0 010-9h4.5A4.5 4.5 0 0118 8.25zM9 15.75A4.5 4.5 0 014.5 11.25v0A4.5 4.5 0 019 6.75v0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);