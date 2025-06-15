import React from 'react';

export interface ActionMenuItem {
  id: string | number;
  type: 'item' | 'separator';
  label?: string;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>; // Specify icon props are SVG-compatible
  iconColor?: string;
  onClick?: () => void;
}

interface ActionMenuProps {
  headerTitle: string;
  items: ActionMenuItem[];
  className?: string; // For positioning or additional styles from parent
  // onClose?: () => void; // Could be added later if needed for internal close mechanisms
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  headerTitle,
  items,
  className,
}) => {
  // Note on 0.5px borders: Using Tailwind's default 1px border with a light color (e.g., border-gray-200)
  // as 0.5px can have inconsistent browser rendering.
  // Note on header text color: Background #FAFBFC is very light.
  // Specified #FFFFFF (white) text would be hard to see. Using text-gray-800.
  return (
    <div
      className={`w-[240px] flex flex-col bg-white rounded-[12px] border border-gray-200 shadow-lg ${className || ''}`}
      // Height will be determined by content ("Hug")
    >
      {/* Header */}
      <div
        className="flex h-[40px] w-full items-center border-b border-gray-200 px-[12px]"
        style={{ backgroundColor: '#FAFBFC' }}
      >
        {/* If there was an icon in the header, gap-[4px] would apply between it and title */}
        <h3 className="text-sm font-medium text-gray-800">{headerTitle}</h3>
      </div>

      {/* Content */}
      <div className="flex flex-col py-1"> {/* Vertical flow for items */}
        {items.map((item) => {
          if (item.type === 'separator') {
            return <hr key={item.id} className="my-1 border-gray-200" />;
          }
          let iconElement: React.ReactNode = null;
          if (item.icon) { // item.icon is now React.ReactElement<React.SVGProps<SVGSVGElement>>
            // item.icon.props is now typed as React.SVGProps<SVGSVGElement> and cannot be undefined for a ReactElement
            const originalIconProps = item.icon.props;
            const combinedIconClassName = `w-4 h-4 ${originalIconProps.className || ''}`.trim();
            iconElement = (
              <span
                className="mr-2 flex-shrink-0"
                style={item.iconColor ? { color: item.iconColor } : {}}
              >
                {React.cloneElement(item.icon, {
                  ...originalIconProps, // Spread all original SVG props
                  className: combinedIconClassName, // Override className
                })}
              </span>
            );
          }

          return ( // This return is for the 'item' type
            <button
              key={item.id}
              onClick={item.onClick}
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
};

export default ActionMenu;
