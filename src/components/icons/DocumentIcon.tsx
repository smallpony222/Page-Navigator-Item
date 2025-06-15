// src/components/icons/DocumentIcon.tsx
import React from 'react';

const DocumentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    width="13" 
    height="18" 
    viewBox="0 0 13 18" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props} // Allows overriding width, height, className, etc.
  >
    <path 
      d="M6.76585 1.67708H1.5521C1.11488 1.67708 0.760437 2.03153 0.760437 2.46875V15.5313C0.760437 15.9685 1.11488 16.3229 1.5521 16.3229H11.4479C11.8852 16.3229 12.2396 15.9685 12.2396 15.5313V7.15084C12.2396 6.94087 12.1562 6.73951 12.0077 6.59104L7.32564 1.90896C7.17718 1.76049 6.97581 1.67708 6.76585 1.67708Z" 
      stroke="currentColor" // Default stroke color from SVG
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
  </svg>
);

export default DocumentIcon;
