import StyledButton from './components/StyledButton';
import React, { useState } from 'react';
import './App.css'; // Keep App.css for any global app styles or remove if not needed

import Navigator, { PageItem } from './components/Navigator';
import Chain from './components/Chain'; // Keep if used elsewhere, or remove if only for Navigator's internals
import AddButton from './components/AddButton'; // Keep if used elsewhere, or remove if only for Navigator's internals

// Import new icons
import InfoIcon from './components/icons/InfoIcon';
import DetailsIcon from './components/icons/DetailsIcon';
import OtherIcon from './components/icons/OtherIcon';
import EndingIcon from './components/icons/EndingIcon';
import AddPageIcon from './components/icons/AddPageIcon';
import DocumentIcon from './components/icons/DocumentIcon'; // Example for newly added pages
import ActionMenu, { ActionMenuItem } from './components/ActionMenu'; // Import ActionMenu

// Import new icons for the settings menu
import SetAsFirstPageIcon from './components/icons/SetAsFirstPageIcon';
import RenameIcon from './components/icons/RenameIcon';
import CopyIcon from './components/icons/CopyIcon';
import DuplicateIcon from './components/icons/DuplicateIcon';
import DeleteIcon from './components/icons/DeleteIcon';

function App() {
  // Updated data for ActionMenu as per new request
  const settingsMenuItems: ActionMenuItem[] = [
    { id: 'set-first', type: 'item', label: 'Set as first page', icon: <SetAsFirstPageIcon />, onClick: () => alert('Set as first page') },
    { id: 'rename', type: 'item', label: 'Rename', icon: <RenameIcon />, onClick: () => alert('Rename') },
    { id: 'copy', type: 'item', label: 'Copy', icon: <CopyIcon />, onClick: () => alert('Copy') },
    { id: 'duplicate', type: 'item', label: 'Duplicate', icon: <DuplicateIcon />, onClick: () => alert('Duplicate') },
    { id: 'sep1', type: 'separator' },
    { id: 'delete', type: 'item', label: 'Delete', icon: <DeleteIcon />, iconColor: '#EF494F', onClick: () => alert('Delete') },
  ];
  const [pageItems, setPageItems] = useState<PageItem[]>([
    {
      id: 'info',
      title: 'Info',
      icon: <InfoIcon className="w-5 h-5" />,
      isActive: true,
      onPageClick: () => handlePageClick('info'),
      onActionClick: () => alert('Info page action!'),
    },
    {
      id: 'details',
      title: 'Details',
      icon: <DetailsIcon className="w-5 h-5" />,
      isActive: false,
      onPageClick: () => handlePageClick('details'),
      onActionClick: () => alert('Details page action!'),
    },
    {
      id: 'other',
      title: 'Other',
      icon: <OtherIcon className="w-5 h-5" />,
      isActive: false,
      onPageClick: () => handlePageClick('other'),
      onActionClick: () => alert('Other page action!'),
    },
    {
      id: 'ending',
      title: 'Ending',
      icon: <EndingIcon className="w-5 h-5" />,
      isActive: false,
      onPageClick: () => handlePageClick('ending'),
      onActionClick: () => alert('Ending page action!'),
    },
    {
      id: 'addPageBtn',
      title: 'Add Page',
      icon: <AddPageIcon className="w-4 h-4" />, // Note: this icon is 16x16 as per SVG
      type: 'addPageAction',
      isActive: false, // This type of button should not become 'active'
      onPageClick: () => alert('Trigger Add Page Flow!'), // Define actual add page logic here
      // onActionClick is not typically used for this button type
    },
  ]);

  const handlePageClick = (id: string | number) => {
    setPageItems((prevItems) =>
      prevItems.map((item) => ({ ...item, isActive: item.id === id }))
    );
  };

  const handleAddItem = (indexAfter: number) => {
    const newPageId = `page-${Date.now()}`;
    const newPage: PageItem = {
      id: newPageId,
      title: `New Page ${pageItems.length - 3}`, // Adjusted title to reflect actual pages
      icon: <DocumentIcon className="w-5 h-5" />, // Default icon for new pages
      isActive: true,
      onPageClick: () => handlePageClick(newPageId),
      onActionClick: () => alert(`Action for ${newPage.title}`),
    };

    setPageItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.splice(indexAfter + 1, 0, newPage);
      return newItems.map((item) => ({ ...item, isActive: item.id === newPageId }));
    });
    console.log(`Add new item after index: ${indexAfter}, ID: ${newPageId}`);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 p-6 pb-40 relative"> {/* Added pb-40 for spacing, relative for potential future absolute children if any */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Page Navigation Demo</h1>
        <p className="text-gray-600 mt-2">Interactive navigation component with dynamic page adding.</p>
      </div>

      {/* Display ActionMenu directly for now */}
      <div className="mb-10 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Action Menu Preview:</h2>
        <ActionMenu headerTitle="Settings" items={settingsMenuItems} />
      </div>

      {/* Fixed Footer Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 w-full flex flex-col items-center">
        <div className="w-full overflow-x-auto"> {/* Allow navigator container to take full width */}
          <Navigator pageItems={pageItems} onAddItemClick={handleAddItem} />
        </div>

      </div>
    </div>
  );
}

export default App;
