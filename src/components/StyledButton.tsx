import React, { useState, useRef, useEffect, forwardRef } from 'react';
import DotsVerticalIcon from './icons/DotsVerticalIcon';
import ActionMenu, { ActionMenuItem } from './ActionMenu';
import { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';

/**
 * @interface StyledButtonProps
 * @description Props for the StyledButton component.
 * @property {string | number} id - Unique identifier for the button, crucial for list operations and event handling.
 * @property {React.ReactNode} icon - Icon to be displayed within the button.
 * @property {string} title - Text label for the button.
 * @property {boolean} [isActive] - Determines if the button is in an active state, influencing styling.
 * @property {(id: string | number) => void} [onButtonClick] - Callback executed when the main button area is clicked.
 * @property {ActionMenuItem[]} [actionItems] - Array of items for the action menu. If provided, enables the action menu trigger.
 * @property {string} [popoverHeaderTitle] - Title for the header of the action menu popover.
 * @property {DraggableAttributes} [attributes] - Attributes provided by @dnd-kit/core for draggable elements.
 * @property {DraggableSyntheticListeners} [listeners] - Event listeners provided by @dnd-kit/core for drag interactions.
 * @property {React.CSSProperties} [style] - Style object, typically used by @dnd-kit for transform styles during drag operations.
 */
interface StyledButtonProps {
  id: string | number;
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
  onButtonClick?: (id: string | number) => void;
  actionItems?: ActionMenuItem[];
  popoverHeaderTitle?: string;
  attributes?: DraggableAttributes;
  listeners?: DraggableSyntheticListeners;
  style?: React.CSSProperties;
}

/**
 * @component StyledButton
 * @description A versatile button component supporting active states, an optional action menu,
 * and integration with @dnd-kit for drag-and-drop functionality.
 * It uses `forwardRef` to allow parent components (like dnd-kit sortable items) to attach a ref to its root DOM element.
 */
const StyledButton = forwardRef<HTMLDivElement, StyledButtonProps>(
  (
    {
      id,
      icon,
      title,
      isActive,
      onButtonClick,
      actionItems,
      popoverHeaderTitle,
      attributes,
      listeners,
      style,
    },
    ref // Forwarded ref, primarily for @dnd-kit's `setNodeRef`.
  ) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Ref for the component's root element. Used for ActionMenu positioning and click-outside detection.
  const componentRootRef = useRef<HTMLDivElement>(null);
  // Ref for the action menu trigger button (three-dots icon).
  const actionButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * @function setCombinedRefs
   * @description Manages multiple refs on a single DOM element.
   * Assigns the node to both the internally managed `componentRootRef` and the `ref` forwarded from the parent (e.g., dnd-kit).
   */
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

  /**
   * @function handleActionClick
   * @description Toggles the visibility of the ActionMenu.
   * Stops event propagation to prevent unintended side effects, such as triggering `onButtonClick`.
   */
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (actionItems && actionItems.length > 0) {
      setIsMenuOpen((prev) => !prev);
    }
  };

  // Effect to handle clicks outside the ActionMenu to close it.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && componentRootRef.current && !componentRootRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const hasActionItems = actionItems && actionItems.length > 0;

  return (
    <div
      ref={setCombinedRefs} // Combines local ref and forwarded ref from dnd-kit.
      style={style} // Applies dnd-kit's transform styles during drag.
      className="relative" // Positioning context for the ActionMenu.
    >
      <div
        className={`
          flex items-center h-[32px] transition-all duration-150 ease-in-out group
          ${isActive
            ? `bg-white border border-[#E1E1E1] shadow-[0_0_3px_rgba(0,0,0,0.04),_0_0_1px_rgba(0,0,0,0.02)] rounded-lg`
            : `bg-[#9DA4B2]/15 text-slate-700 rounded-lg hover:bg-[#9DA4B2]/35 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#2F72E2] focus-within:ring-inset focus-within:shadow-[0_0_3px_rgba(0,0,0,0.04),_0_0_1px_rgba(0,0,0,0.02),_0_0_0_1.5px_rgba(47,114,226,0.25)]`
          }
        `}
      >
        {/* The main button is now the DRAG HANDLE. Clicks and drags are initiated here. */}
        <button
          type="button"
          {...attributes} // dnd-kit attributes for accessibility.
          {...listeners} // dnd-kit listeners that make this button the drag handle.
          onClick={() => {
            if (onButtonClick && id !== undefined) {
              onButtonClick(id);
            }
          }}
          className={`
            flex items-center h-full py-1 px-2.5 focus:outline-none flex-grow min-w-0 cursor-grab
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

        {/* The action button is now OUTSIDE the drag handle, so its onClick will not be captured by dnd-kit. */}
        {isActive && hasActionItems && (
          <button
            ref={actionButtonRef}
            type="button"
            aria-label="Actions"
            onClick={handleActionClick}
            className="h-full w-[24px] flex-shrink-0 flex items-center justify-center p-0.5 focus:outline-none bg-transparent text-slate-800 hover:bg-slate-200 rounded-r-lg"
          >
            <DotsVerticalIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ActionMenu is rendered conditionally, positioned relative to the root div. */}
      {isMenuOpen && isActive && hasActionItems && popoverHeaderTitle && componentRootRef.current && (
        <ActionMenu
          headerTitle={popoverHeaderTitle}
          items={actionItems!}
          triggerRef={componentRootRef}
          onClose={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
});

// Setting displayName is a good practice for components wrapped with `forwardRef` for better debugging.
StyledButton.displayName = 'StyledButton';

// `React.memo` optimizes the component by memoizing it, preventing re-renders if props haven't changed.
export default React.memo(StyledButton);
