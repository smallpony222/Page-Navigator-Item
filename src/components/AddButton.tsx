import React from 'react';

interface AddButtonProps {
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick, className, 'aria-label': ariaLabel = "Add item" }) => {
  // Tailwind classes based on user request interpretation:
  // Width: 16px -> w-4
  // Height: 16px -> h-4
  // Radius: 8px -> rounded-full (for a 16x16 element, this makes it a circle)
  // Border: 0.5px -> Using 'border' (1px standard Tailwind). Color: border-gray-300.
  // Padding: Specified padding (T4, R10, B4, L10) is too large for a 16x16px fixed size.
  //          Instead, centering the '+' icon using flexbox.

  const baseClasses = "w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${className || ''}`}
      aria-label={ariaLabel}
    >
      <span className="text-sm leading-4 select-none">+</span>
    </button>
  );
};

export default AddButton;
