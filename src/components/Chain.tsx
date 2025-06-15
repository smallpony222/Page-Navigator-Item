// src/components/Chain.tsx
import React from 'react';

interface ChainProps {
  className?: string; // Allow additional classes for custom styling
  dashed?: boolean;   // New prop to indicate if the line should be dashed
}

const Chain: React.FC<ChainProps> = ({ className, dashed }) => {
  let baseStyle = `w-[20px] ${className || ''}`;

  if (dashed) {
    // For a dashed line, use a bottom border.
    // Tailwind's border-dashed will be 1px by default.
    // We set height to 0 so only the border is visible.
    baseStyle += ' h-0 border-b border-dashed border-[#C0C0C0]';
  } else {
    // Original solid line style
    baseStyle += ' h-[1.5px] bg-[#C0C0C0]';
  }

  return (
    <div 
      className={baseStyle}
      role="separator" // Adding a role for accessibility, assuming it's a visual separator
    >
    </div>
  );
};

export default Chain;
