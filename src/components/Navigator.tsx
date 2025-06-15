import React from 'react';
import StyledButton from './StyledButton';
import Chain from './Chain';
import AddButton from './AddButton';
import { ActionMenuItem } from './ActionMenu'; // Import ActionMenuItem

export interface PageItem {
  id: string | number;
  title: string;
  icon: React.ReactElement;
  type?: 'page' | 'addPageAction';
  isActive?: boolean;
  onPageClick?: () => void;
  actionItems?: ActionMenuItem[]; // Added for ActionMenu
  popoverHeaderTitle?: string; // Added for ActionMenu
}

interface NavigatorProps {
  pageItems: PageItem[];
  onAddItemClick?: (indexAfter: number) => void; // index of the item *before* which the new item could be added
  className?: string;
}

const Navigator: React.FC<NavigatorProps> = ({ pageItems, onAddItemClick, className }) => {
  return (
    <div className={`flex items-center ${className || ''}`}>
      {pageItems.map((item, index) => {
        if (item.type === 'addPageAction') {
          return (
            <React.Fragment key={item.id}>
              <button
                type="button"
                onClick={item.onPageClick} // Main action for this button type
                className="flex items-center py-1 px-2.5 text-[#1A1A1A] bg-white border border-[#E1E1E1] shadow-[0_0_3px_rgba(0,0,0,0.04),_0_0_1px_rgba(0,0,0,0.02)] hover:bg-gray-50 rounded-lg transition-colors h-[32px]"
                aria-label={item.title}
              >
                <span className={`mr-2 flex-shrink-0 text-[#1A1A1A]`}>{item.icon}</span>
                <span className="text-sm truncate">{item.title}</span>
              </button>
              {/* Render connector only if it's not the very last item overall and there's a next item */}
              {index < pageItems.length - 1 && (
                <>
                  <Chain dashed={true} />
                  <AddButton 
                    aria-label={`Add page after ${item.title}`}
                    onClick={() => onAddItemClick?.(index)} 
                  />
                  <Chain dashed={true} />
                </>
              )}
            </React.Fragment>
          );
        }
        // Default to StyledButton for 'page' type or if type is undefined
        return (
          <React.Fragment key={item.id}>
            <StyledButton
              icon={item.icon}
              title={item.title}
              isActive={item.isActive}
              onButtonClick={item.onPageClick}
              actionItems={item.actionItems} // Pass actionItems
              popoverHeaderTitle={item.popoverHeaderTitle} // Pass popoverHeaderTitle
            />
            {index < pageItems.length - 1 && (
              <>
                <Chain dashed={true} />
                <AddButton 
                  aria-label={`Add page after ${item.title}`}
                  onClick={() => onAddItemClick?.(index)} 
                />
                <Chain dashed={true} />
              </>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Navigator;
