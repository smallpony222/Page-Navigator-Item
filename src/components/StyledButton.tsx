// src/components/StyledButton.tsx
import React, { useState, useRef, useEffect, forwardRef, memo } from 'react'; // Added forwardRef and memo
import DotsVerticalIcon from './icons/DotsVerticalIcon';
import ActionMenu, { ActionMenuItem } from './ActionMenu';
import { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core'; // Added

interface StyledButtonProps {
  id: string | number; // Added id prop
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
  onButtonClick?: (id: string | number) => void; // Updated signature
  actionItems?: ActionMenuItem[];
  popoverHeaderTitle?: string;
  // Props from useSortable
  attributes?: DraggableAttributes;
  listeners?: DraggableSyntheticListeners;
  style?: React.CSSProperties; // For dnd-kit transforms
}

const StyledButton = forwardRef<HTMLDivElement, StyledButtonProps>(
  (
    {
      id, // Destructure id
      icon,
      title,
      isActive,
      onButtonClick,
      actionItems,
      popoverHeaderTitle,
      attributes, // Destructure
      listeners,  // Destructure
      style,      // Destructure
    },
    ref // This is the ref from useSortable (setNodeRef)
  ) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    // This ref is for the root element of StyledButton, used for click-outside and ActionMenu positioning
  const componentRootRef = useRef<HTMLDivElement>(null);
  const actionButtonRef = useRef<HTMLButtonElement>(null); // Ref for the three-dots button

    // Callback ref to assign the DOM node to both the forwarded ref (from dnd-kit)
    // and the internal componentRootRef.
  const setCombinedRefs = (node: HTMLDivElement | null) => {
    (componentRootRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref && typeof ref === 'object') {
      ref.current = node;
    }
  };

  const activeIconColor = 'text-[#F59D0E]';
  const inactiveIconColor = 'text-[#8C93A1]';

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling to onButtonClick or other handlers
    if (actionItems && actionItems.length > 0) {
      setIsMenuOpen((prev) => {
        console.log('[StyledButton] Toggling menu. Current isMenuOpen:', prev, 'Will be:', !prev);
        return !prev;
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && componentRootRef.current && !componentRootRef.current.contains(event.target as Node)) {
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
  }, [isMenuOpen]); // componentRootRef is stable, no need in deps

  const hasActionItems = actionItems && actionItems.length > 0;
  console.log(`[StyledButton] Rendering. ID: ${id}, Title: ${title}, isActive: ${isActive}, hasActionItems: ${hasActionItems}, actionItems length: ${actionItems?.length}`);

  return (
    // Wrapper for ActionMenu positioning context (now componentRootRef) and click-outside detection for the menu
    // This is also the draggable element.
    <div
      ref={setCombinedRefs} // Apply combined refs for dnd-kit and internal logic
      className="relative" // Existing class
      style={style} // Apply dnd-kit transform styles
      {...attributes} // Spread dnd attributes (e.g., role, aria-pressed)
      {...listeners} // Spread dnd listeners (makes the whole component a drag handle)
    >
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
          onMouseDown={(e) => {
            console.log('[StyledButton] Main button area onMouseDown. Calling onButtonClick.');
            if (onButtonClick && id !== undefined) { onButtonClick(id); }
            e.stopPropagation();
          }}
          
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
              onMouseUp={handleActionClick}
              onMouseDown={(e) => {
                console.log('[StyledButton] Action button onMouseDown, stopping propagation.');
                e.stopPropagation();
              }}
              className="h-full w-[24px] flex-shrink-0 flex items-center justify-center p-0.5 focus:outline-none bg-transparent text-gray-500 hover:bg-gray-200/70 rounded-r-lg"
            >
              <DotsVerticalIcon className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* ActionMenu (portaled) */} 
      {/* ActionMenu (portaled) */}
      {isMenuOpen && isActive && hasActionItems && popoverHeaderTitle && actionButtonRef.current && (
        <ActionMenu
          headerTitle={popoverHeaderTitle}
          items={actionItems!} // Assert non-null as hasActionItems is true
          triggerRef={actionButtonRef} // Position relative to the action button
          onClose={() => setIsMenuOpen(false)} // Callback to close the menu
        />
      )}
    </div>
  );
});

StyledButton.displayName = 'StyledButton'; // Good practice for forwardRef components

export default React.memo(StyledButton);
