// src/components/icons/DotsVerticalIcon.tsx
import React from 'react';

const DotsVerticalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="16" // Default width, can be overridden by className
    height="16" // Default height, can be overridden by className
    viewBox="0 0 16 16"
    fill="currentColor" // Inherits color from parent's text color
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="8" cy="3" r="1.5" />
    <circle cx="8" cy="8" r="1.5" />
    <circle cx="8" cy="13" r="1.5" />
  </svg>
);

export default DotsVerticalIcon;
