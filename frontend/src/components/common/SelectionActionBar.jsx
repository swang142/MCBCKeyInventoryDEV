import React from 'react';
import './SelectionActionBar.css'; // CSS for styling the action bar
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

// Component to render a trash can icon
const TrashCanIcon = () => {
  return <FontAwesomeIcon icon={faTrash} />; // Renders FontAwesome trash can icon
}

const SelectionActionBar = ({ selectedRows, setTrigger, deleteType }) => {

  // Handles the deletion of selected entries
  const deleteEntries = () => {
    selectedRows.forEach(row => deleteType(row)); // Call deleteType for each selected row
    setTrigger(prev => !prev); // Toggle trigger state to update UI
  }

  return (
    <div className={`selection-action-bar ${selectedRows.length > 0 ? 'active' : ''}`}>
      <Button 
        className="delete-button" 
        onClick={deleteEntries} 
        startIcon={<TrashCanIcon />}
      >
        Delete
      </Button>
    </div>
  );
}

export default SelectionActionBar;
