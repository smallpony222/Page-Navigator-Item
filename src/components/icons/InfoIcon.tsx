import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const InfoIcon: React.FC<IconProps> = (props) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8.95835 9.16667H10L10 13.5417M17.7084 10C17.7084 14.2572 14.2572 17.7083 10 17.7083C5.74283 17.7083 2.29169 14.2572 2.29169 10C2.29169 5.74281 5.74283 2.29167 10 2.29167C14.2572 2.29167 17.7084 5.74281 17.7084 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.0003 6.125C10.2993 6.12518 10.5413 6.36795 10.5413 6.66699C10.5411 6.96589 10.2992 7.20783 10.0003 7.20801C9.70126 7.20801 9.45849 6.966 9.45831 6.66699C9.45831 6.36784 9.70115 6.125 10.0003 6.125Z" fill="currentColor" stroke="currentColor" strokeWidth="0.25"/>
    </svg>
  );
};

export default InfoIcon;
