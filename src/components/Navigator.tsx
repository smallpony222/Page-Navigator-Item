import React, { memo } from 'react'; // Ensure memo is imported if not already
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  onPageClick?: (id: string | number) => void;
  actionItems?: ActionMenuItem[]; // Added for ActionMenu
  popoverHeaderTitle?: string; // Added for ActionMenu
}

interface NavigatorProps {
  pageItems: PageItem[];
  onAddItemClick?: (indexAfter: number) => void; // index of the item *before* which the new item could be added
  onDragEnd: (event: DragEndEvent) => void; // For reordering
  className?: string;
}

// Internal Sortable Item Component
interface SortablePageItemProps {
  item: PageItem;
  pageItems: PageItem[]; // Added pageItems prop
  onAddItemClick?: (indexAfter: number) => void;
  isLastItem: boolean; // To conditionally render trailing AddButton/Chain
}

const SortablePageItem = memo<SortablePageItemProps>(({ item, pageItems, onAddItemClick, isLastItem }) => {
  const isDraggablePage = item.type === 'page' || item.type === undefined;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    // 'disabled' is an option passed to useSortable, not a returned property to destructure
  } = useSortable({ 
    id: item.id,
    disabled: !isDraggablePage, // Only 'page' items are draggable
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined, // Keep dragged item on top
    opacity: isDragging ? 0.8 : 1,
  };

  // Common rendering logic for StyledButton and AddPageAction button
  const renderButton = () => {
    if (item.type === 'addPageAction') {
      return (
        <button
          type="button"
          onClick={item.onPageClick ? (_event) => item.onPageClick!(item.id) : undefined} // Main action for this button type
          className="flex items-center py-1 px-2.5 text-[#1A1A1A] bg-white border border-[#E1E1E1] shadow-[0_0_3px_rgba(0,0,0,0.04),_0_0_1px_rgba(0,0,0,0.02)] hover:bg-gray-50 rounded-lg transition-colors h-[32px]"
          aria-label={item.title}
        >
          <span className={`mr-2 flex-shrink-0 text-[#1A1A1A]`}>{item.icon}</span>
          <span className="text-sm truncate">{item.title}</span>
        </button>
      );
    }
    // Default to StyledButton for 'page' type or if type is undefined
    return (
      <StyledButton
        id={item.id} // Pass id to StyledButton
        icon={item.icon}
        title={item.title}
        isActive={item.isActive}
        onButtonClick={item.onPageClick}
        actionItems={item.actionItems}
        popoverHeaderTitle={item.popoverHeaderTitle}
        // Pass dnd-kit props only if it's a draggable page item
        attributes={isDraggablePage ? attributes : undefined}
        listeners={isDraggablePage ? listeners : undefined}
        style={isDraggablePage ? style : undefined} // Apply transform/transition styles
        ref={isDraggablePage ? setNodeRef : undefined} // Pass ref to StyledButton
      />
    );
  };

  return (
    <React.Fragment>
      <div ref={isDraggablePage ? undefined : setNodeRef} style={isDraggablePage ? undefined : style} className="flex items-center">
        {/* If not draggable, the div itself is the sortable node. If draggable, StyledButton is. */}
        {/* This structure ensures non-draggable items still occupy sortable space correctly. */}
        {renderButton()}
      </div>
      {!isLastItem && (
        <>
          <Chain dashed={true} />
          <AddButton 
            aria-label={`Add page after ${item.title}`}
            onClick={() => {
              const currentIndex = pageItems.findIndex((pi: PageItem) => pi.id === item.id);
              if (currentIndex !== -1) {
                onAddItemClick?.(currentIndex);
              }
            }} 
          />
          <Chain dashed={true} />
        </>
      )}
    </React.Fragment>
  );
});

const Navigator: React.FC<NavigatorProps> = ({ pageItems, onAddItemClick, onDragEnd, className }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Temporarily reduced for debugging click vs. drag
        delay: 0, // Was 100
        tolerance: 1, // Was 5
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // Filter out non-page items for SortableContext if they are not meant to be part of the sortable list
  // However, for this setup, all items in pageItems are part of the visual sequence.
  const sortableItemIds = pageItems.map(item => item.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={sortableItemIds} strategy={horizontalListSortingStrategy}>
        <div className={`flex items-center ${className || ''}`}>
      {pageItems.map((item, index) => (
        <SortablePageItem 
          key={item.id} 
          item={item} 
          pageItems={pageItems} // Pass pageItems down
          onAddItemClick={onAddItemClick} 
          isLastItem={index === pageItems.length - 1}
        />
      ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default Navigator;
