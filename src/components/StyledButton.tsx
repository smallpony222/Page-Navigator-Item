// src/components/StyledButton.tsx
import React, { useState } from 'react';
import DotsVerticalIcon from './icons/DotsVerticalIcon';

interface StyledButtonProps {
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
  onButtonClick?: () => void;
  onActionClick?: () => void; // Optional: Click handler for the three-dots action tag
}

const StyledButton: React.FC<StyledButtonProps> = ({ icon, title, isActive, onButtonClick, onActionClick }) => {

  const baseClasses =
    'flex items-center justify-between h-[32px] rounded-lg py-1 px-2.5 transition-all duration-150 ease-in-out focus:outline-none';

  // Default state (not active)
  const defaultStateClasses = 'w-[84px] bg-[#9DA4B2]/15 text-slate-700'; // text-slate-700 is a placeholder
  const hoverClasses = 'hover:bg-[#9DA4B2]/35';
  const focusClasses =
    'focus:bg-white focus:ring-1 focus:ring-[#2F72E2] focus:ring-inset focus:shadow-[0_0_3px_rgba(0,0,0,0.04),_0_0_1px_rgba(0,0,0,0.02),_0_0_0_1.5px_rgba(47,114,226,0.25)]';

  // Active state
  const activeStateClasses =
    'w-[108px] bg-white border border-[#E1E1E1] shadow-[0_0_3px_rgba(0,0,0,0.04),_0_0_1px_rgba(0,0,0,0.02)] text-slate-800'; // text-slate-800 is for the title text

  const activeIconColor = 'text-[#F59D0E]';
  const inactiveIconColor = 'text-[#8C93A1]';

  return (
    <button
      type="button"
      onClick={onButtonClick}
      className={`
        ${baseClasses}
        ${
          isActive
            ? activeStateClasses
            : `${defaultStateClasses} ${hoverClasses} ${focusClasses}`
        }
      `}
    >
      <div className="flex items-center overflow-hidden flex-grow min-w-0"> {/* Group icon and title */}
        <span className={`mr-2 flex-shrink-0 ${isActive ? activeIconColor : inactiveIconColor}`}>{icon}</span>
        <span className="truncate text-sm">{title}</span> {/* Added text-sm for better fit */}
      </div>

      {isActive && (
        <div
          role="button"
          aria-label="Actions"
          onClick={(e) => {
            e.stopPropagation(); // Prevent parent button's onClick
            if (onActionClick) {
              onActionClick();
            }
          }}
          className="ml-1 p-0.5 rounded text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 flex-shrink-0"
        >
          <DotsVerticalIcon className="w-4 h-4" />
        </div>
      )}
    </button>
  );
};

export default StyledButton;
