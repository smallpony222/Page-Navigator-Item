import React, { useState, useCallback, useEffect, useMemo } from 'react'; // Added useMemo
import './App.css'; // Keep App.css for any global app styles or remove if not needed

import Navigator, { PageItem } from './components/Navigator';

// Import new icons
import InfoIcon from './components/icons/InfoIcon';
import DetailsIcon from './components/icons/DetailsIcon';
import OtherIcon from './components/icons/OtherIcon';
import EndingIcon from './components/icons/EndingIcon';
import AddPageIcon from './components/icons/AddPageIcon';
import { DragEndEvent } from '@dnd-kit/core'; // Added
import { arrayMove } from '@dnd-kit/sortable'; // Added
import DocumentIcon from './components/icons/DocumentIcon'; // Example for newly added pages
import { ActionMenuItem } from './components/ActionMenu'; // Import ActionMenu
import StyledButton from './components/StyledButton';
import ActionMenu from './components/ActionMenu';
import Chain from './components/Chain';
import AddButton from './components/AddButton';

// Import new icons for the settings menu
import SetAsFirstPageIcon from './components/icons/SetAsFirstPageIcon';
import RenameIcon from './components/icons/RenameIcon';
import CopyIcon from './components/icons/CopyIcon';
import DuplicateIcon from './components/icons/DuplicateIcon';
import DeleteIcon from './components/icons/DeleteIcon';

// Define menu items outside the component to ensure they are stable references
const settingsMenuItems: ActionMenuItem[] = [
    { id: 'set-first', type: 'item', label: 'Set as first page', icon: <SetAsFirstPageIcon />, onClick: () => {} },
    { id: 'rename', type: 'item', label: 'Rename', icon: <RenameIcon />, onClick: () => {} },
    { id: 'copy', type: 'item', label: 'Copy', icon: <CopyIcon />, onClick: () => {} },
    { id: 'duplicate', type: 'item', label: 'Duplicate', icon: <DuplicateIcon />, onClick: () => {} },
    { id: 'sep1', type: 'separator' },
    { id: 'delete', type: 'item', label: 'Delete', icon: <DeleteIcon />, iconColor: '#EF494F', onClick: () => {} },
  ];

function App() {
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  const demoMenuTriggerRef = React.useRef<HTMLButtonElement>(null);
  // settingsMenuItems definition removed from here
  // The array above was erroneously re-inserted here and is now removed.

  // Define handlers before initialPageItems
  const [pageItems, setPageItems] = useState<PageItem[]>([]); // Initialize with empty array first

  const handlePageClick = useCallback((clickedId: string | number) => {
    setPageItems((prevItems) => {
      const newItems = prevItems.map((item) => {
        const isActive = item.id === clickedId;
        if (item.id === clickedId) {
        } else if (item.isActive && item.id !== clickedId) {
        }
        return { ...item, isActive: isActive };
      });
      return newItems;
    });
  }, []); // No dependencies needed as setPageItems updater form is used

  const handleAddItem = useCallback((indexAfter: number) => {
    const newPageId = `page-${Date.now()}`;
    const newPageTitle = `New Page ${pageItems.filter(item => item.type !== 'addPageAction').length + 1}`;
    const newPage: PageItem = {
      id: newPageId,
      title: newPageTitle,
      icon: <DocumentIcon className="w-5 h-5" />,
      type: 'page',
      isActive: true,
      onPageClick: handlePageClick,
      actionItems: settingsMenuItems,
      popoverHeaderTitle: `${newPageTitle} Settings`,
    };

    setPageItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.splice(indexAfter + 1, 0, newPage);
      return newItems.map((item) => ({ ...item, isActive: item.id === newPageId }));
    });
  }, [pageItems, handlePageClick]); // settingsMenuItems is stable, handlePageClick is a dep

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPageItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  // Define initialPageItems after handlers, using useMemo for stability
  const initialPageItems = useMemo((): PageItem[] => [
    {
      id: 'info',
      title: 'Info',
      icon: <InfoIcon className="w-5 h-5" />,
      type: 'page', // Explicitly set type
      isActive: true,
      onPageClick: handlePageClick,
      actionItems: settingsMenuItems,
      popoverHeaderTitle: 'Info Settings',
    },
    {
      id: 'details',
      title: 'Details',
      icon: <DetailsIcon className="w-5 h-5" />,
      type: 'page',
      isActive: false,
      onPageClick: handlePageClick,
      actionItems: settingsMenuItems,
      popoverHeaderTitle: 'Details Settings',
    },
    {
      id: 'other',
      title: 'Other',
      icon: <OtherIcon className="w-5 h-5" />,
      type: 'page',
      isActive: false,
      onPageClick: handlePageClick,
      actionItems: settingsMenuItems,
      popoverHeaderTitle: 'Other Settings',
    },
    {
      id: 'ending',
      title: 'Ending',
      icon: <EndingIcon className="w-5 h-5" />,
      type: 'page',
      isActive: false,
      onPageClick: handlePageClick,
      actionItems: settingsMenuItems,
      popoverHeaderTitle: 'Ending Settings',
    },
    {
      id: 'addPageBtn',
      title: 'Add Page',
      icon: <AddPageIcon className="w-4 h-4" />,
      type: 'addPageAction',
      isActive: false,
      onPageClick: (id: string | number) => {},
    },
  ], [handlePageClick]); // settingsMenuItems is stable from outer scope, handlePageClick is the key dependency

  // Effect to set initial page items after component mounts and handlers are defined
  useEffect(() => {
    setPageItems(initialPageItems);
  }, [initialPageItems]); // Depend on the memoized initialPageItems

  // Effect to monitor pageItems changes
  useEffect(() => {
  }, [pageItems]);

  return (
    <div className="flex flex-col items-center bg-gray-100 p-6 pb-40 relative"> 
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Page Navigation Demo</h1>
        <p className="text-gray-600 mt-2">Interactive navigation component with dynamic page adding.</p>
      </div>

      {/* Component Showcase Section */}
      <div className="mb-10 p-6 bg-white shadow-lg rounded-lg w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Component Showcase</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: StyledButton States */}
          <div className="p-4 border rounded-md shadow-sm bg-slate-50 flex flex-col space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">StyledButton States</h3>
            <StyledButton id="demo-inactive" icon={<InfoIcon />} title="Inactive Button" isActive={false} onButtonClick={() => {}} />
            <StyledButton id="demo-active" icon={<DetailsIcon />} title="Active Button" isActive={true} onButtonClick={() => {}} />
            <div>
              <StyledButton id="demo-hover-focus" icon={<OtherIcon />} title="Hover/Focus Me" onButtonClick={() => {}} />
              <p className="text-xs text-gray-500 mt-1">Interact with this button to see hover and focus states defined in CSS.</p>
            </div>
          </div>

          {/* Card 2: ActionMenu Focus */}
          <div className="p-4 border rounded-md shadow-sm bg-slate-50 flex flex-col space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">ActionMenu Focus</h3>
            <StyledButton 
              id="demo-active-menu-card2"
              icon={<OtherIcon />} 
              title="Button w/ Menu"
              isActive={true}
              onButtonClick={() => {console.log('Button clicked!')}}
              actionItems={settingsMenuItems}
              popoverHeaderTitle="Button's Menu"
            />
            <div>
              <button 
                ref={demoMenuTriggerRef}
                onClick={() => setIsDemoMenuOpen(prev => !prev)} 
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Toggle Standalone Menu
              </button>
              {isDemoMenuOpen && demoMenuTriggerRef.current && (
                <ActionMenu 
                  headerTitle="Standalone Menu"
                  items={settingsMenuItems} 
                  triggerRef={demoMenuTriggerRef} 
                  onClose={() => setIsDemoMenuOpen(false)}
                />
              )}
            </div>
          </div>

          {/* Card 3: Miscellaneous Components & Icons */}
          <div className="p-4 border rounded-md shadow-sm bg-slate-50 flex flex-col space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Other Elements</h3>
            <div>
              <h4 className="text-md font-medium text-gray-600 mb-1">Chain (Dashed)</h4>
              <div className="flex justify-center"><Chain dashed={true} /></div>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-600 mb-1">Add Button</h4>
              <div className="flex justify-center"><AddButton onClick={() => {}} /></div>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-600 mb-1">SVG Icons</h4>
              <div className="flex space-x-4 items-center justify-center pt-1">
                <InfoIcon className="w-5 h-5 text-blue-600" />
                <DetailsIcon className="w-5 h-5 text-green-600" />
                <OtherIcon className="w-5 h-5 text-purple-600" />
                {/* You can add more icons like SettingsIcon, DuplicateIcon here if needed */}
              </div>
            </div>
          </div>

        </div> {/* Closes the grid div */}
      </div> {/* Closes the main Component Showcase Section div */}

      {/* Fixed Footer Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 w-full flex flex-col items-center">
        <div className="w-full overflow-x-auto overflow-y-visible"> {/* Allow navigator container to take full width and ensure vertical overflow is visible */}
          <Navigator pageItems={pageItems} onAddItemClick={handleAddItem} onDragEnd={handleDragEnd} />
        </div>

      </div>
    </div>
  );
}

export default App;
