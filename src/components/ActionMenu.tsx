import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

export interface ActionMenuItem {
  id: string | number;
  type: 'item' | 'separator';
  label?: string;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  iconColor?: string;
  onClick?: () => void;
}

interface ActionMenuProps {
  headerTitle: string;
  items: ActionMenuItem[];
  triggerRef: React.RefObject<HTMLElement | null>;
  onClose?: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  headerTitle,
  items,
  triggerRef,
  onClose,
}) => {
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (triggerRef.current && menuRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current.offsetHeight;
      const top = triggerRect.top - menuHeight - 9; // 9px offset upwards
      const left = triggerRect.left;

      // Update position only if it has changed to prevent potential loops
      if (!menuPosition || menuPosition.top !== top || menuPosition.left !== left) {
        setMenuPosition({ top, left });
      }
    }
    // Dependencies: Re-calculate if the trigger element, items (affecting height), or header (affecting height) change.
    // menuRef.current itself shouldn't be a dependency as its change doesn't trigger re-render.
    // The effect runs after layout, so menuRef.current will be up-to-date.
  }, [triggerRef, items, headerTitle, menuPosition]);

  const menuStyle: React.CSSProperties = menuPosition
    ? {
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
        visibility: 'visible',
        position: 'fixed', // Ensure position fixed is explicitly set
        zIndex: 50, // Ensure it's above other content
      }
    : {
        visibility: 'hidden', // Render hidden initially to measure
        position: 'fixed',
        zIndex: 50,
      };

  const menuContent = (
    <div
      ref={menuRef}
      className="w-[240px] flex flex-col bg-white rounded-[12px] border border-gray-200 shadow-lg"
      style={menuStyle}
    >
      {/* Header */}
      <div
        className="flex h-[40px] w-full items-center border-b border-gray-200 px-[12px]"
        style={{ backgroundColor: '#FAFBFC' }}
      >
        <h3 className="text-sm font-medium text-gray-800">{headerTitle}</h3>
      </div>

      {/* Content */}
      <div className="flex flex-col py-1">
        {items.map((item) => {
          if (item.type === 'separator') {
            return <hr key={item.id} className="my-1 border-gray-200" />;
          }
          let iconElement: React.ReactNode = null;
          if (item.icon) {
            const originalIconProps = item.icon.props;
            const combinedIconClassName = `w-4 h-4 ${originalIconProps.className || ''}`.trim();
            iconElement = (
              <span
                className="mr-2 flex-shrink-0"
                style={item.iconColor ? { color: item.iconColor } : {}}
              >
                {React.cloneElement(item.icon, {
                  ...originalIconProps,
                  className: combinedIconClassName,
                })}
              </span>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                item.onClick?.();
                onClose?.();
              }}
              className="flex w-full items-center px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              role="menuitem"
            >
              {iconElement}
              <span className="flex-grow truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Create the portal only if triggerRef.current exists, ensuring it's mounted conditionally
  // This also implicitly means that StyledButton is ready to show the menu.
  if (!triggerRef.current) {
    return null;
  }

  return ReactDOM.createPortal(menuContent, document.body);
};

export default ActionMenu;
