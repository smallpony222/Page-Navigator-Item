// src/components/StyledButton.tsx
import React, { useState, useRef, useEffect } from 'react';
import DotsVerticalIcon from './icons/DotsVerticalIcon';
import ActionMenu, { ActionMenuItem } from './ActionMenu';

interface StyledButtonProps {
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
  onButtonClick?: () => void;
  actionItems?: ActionMenuItem[];
  popoverHeaderTitle?: string;
}

const StyledButton: React.FC<StyledButtonProps> = ({
  icon,
  title,
  isActive,
  onButtonClick,
  actionItems,
  popoverHeaderTitle,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Ref for the entire button group for ActionMenu positioning & click-outside
  const actionButtonRef = useRef<HTMLButtonElement>(null); // Ref for the three-dots button itself

  const activeIconColor = 'text-[#F59D0E]';
  const inactiveIconColor = 'text-[#8C93A1]';

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling to onButtonClick or other handlers
    if (actionItems && actionItems.length > 0) {
      setIsMenuOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If menu is open and click is outside the entire button component (menuRef),
      // then close the menu.
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    // Only add listener if menu is open to avoid unnecessary listeners
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, menuRef]); // Effect dependencies

  const hasActionItems = actionItems && actionItems.length > 0;

  return (
    // Wrapper for ActionMenu positioning context (menuRef) and click-outside detection for the menu
    <div className="relative" ref={menuRef}>
      {/* Main container for the button or button group styling */} 
      <div
        className={`
          flex items-center h-[32px] transition-all duration-150 ease-in-out group
          ${isActive
            ? `w-[108px] bg-white border border-[#E1E1E1] shadow-[0_0_3px_rgba(0,0,0,0.04),_0_0_1px_rgba(0,0,0,0.02)] rounded-lg`
            : `w-[84px] bg-[#9DA4B2]/15 text-slate-700 rounded-lg hover:bg-[#9DA4B2]/35 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#2F72E2] focus-within:ring-inset focus-within:shadow-[0_0_3px_rgba(0,0,0,0.04),_0_0_1px_rgba(0,0,0,0.02),_0_0_0_1.5px_rgba(47,114,226,0.25)]`
          }
        `}
      >
        {/* Main clickable area (icon and title) */} 
        <button
          type="button"
          onClick={onButtonClick}
          className={`
            flex items-center h-full py-1 px-2.5 focus:outline-none flex-grow min-w-0 
            ${isActive
              ? `bg-transparent text-slate-800 ${hasActionItems ? 'rounded-l-lg' : 'rounded-lg'}` 
              : `bg-transparent text-inherit justify-center w-full rounded-lg`
            }
          `}
        >
          <div className="flex items-center overflow-hidden flex-grow min-w-0">
            <span className={`mr-2 flex-shrink-0 ${isActive ? activeIconColor : inactiveIconColor}`}>{icon}</span>
            <span className="truncate text-sm">{title}</span>
          </div>
        </button>

        {/* Action trigger button (three-dots) - only if active and has items */} 
        {isActive && hasActionItems && (
          <>
            {/* Separator line */} 
            <div className="h-[20px] w-px bg-[#E1E1E1] self-center"></div>
            <button
              ref={actionButtonRef} // Ref for this specific button
              type="button"
              aria-label="Actions"
              onClick={handleActionClick}
              className="h-full w-[24px] flex-shrink-0 flex items-center justify-center p-0.5 focus:outline-none bg-transparent text-gray-500 hover:bg-gray-200/70 rounded-r-lg"
            >
              <DotsVerticalIcon className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* ActionMenu (portaled) */} 
      {isMenuOpen && isActive && hasActionItems && popoverHeaderTitle && menuRef.current && (
        <ActionMenu
          headerTitle={popoverHeaderTitle}
          items={actionItems!} // Assert non-null as hasActionItems is true
          triggerRef={menuRef} // Position relative to the entire button group
          onClose={() => setIsMenuOpen(false)} // Callback to close the menu
        />
      )}
    </div>
  );
};

export default StyledButton;
