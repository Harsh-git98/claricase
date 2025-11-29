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
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.625 15.75H6.75A2.25 2.25 0 0 1 4.5 13.5V6.75A2.25 2.25 0 0 1 6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75v6.75a2.25 2.25 0 0 1-2.25 2.25h-4.94L8.1 19.2a.75.75 0 0 1-1.224-.586v-2.864z"
    />
  </svg>
);
