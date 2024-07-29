import React from 'react'
import './SelectionActionBar.css'
import { Button } from '@mui/material'
import './SelectionActionBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const TrashCanIcon = () => {
  return <FontAwesomeIcon icon={faTrash} />;
}

const SelectionActionBar = ({selectedRows, setTrigger, deleteType}) => {

  const deleteEntries = () => {
      for (const row of selectedRows){
        deleteType(row);
      }
      setTrigger(prev => !prev);
    }

  return (
    <div class= {`selection-action-bar ${selectedRows.length > 0 ? 'active' : ''}`}>
      <Button className="delete-button" onClick={deleteEntries} startIcon={<TrashCanIcon />}>
        Delete
      </Button>
    </div>
  )
}

export default SelectionActionBar