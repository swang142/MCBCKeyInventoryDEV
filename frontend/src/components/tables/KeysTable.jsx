import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import './Table.css';
import { deleteKey, getKeys, updateKey } from '../../../api/apicommunicator';
import SelectionActionBar from '../common/SelectionActionBar';
import AddKeyModal from '../modals/AddKeyModal';
import toast from 'react-hot-toast'; // Add this import if it's used

const KeysTable = ({ open, setOpen }) => {
  const [rows, setRows] = useState([]); // State to hold the table rows
  const [trigger, setTrigger] = useState(false); // Trigger to refresh data
  const [selectedRows, setSelectedRows] = useState([]); // State for selected rows

  // Handle row selection changes
  const handleSelectionChange = (selectionModel) => {
    setSelectedRows(selectionModel);
  };

  // Define columns for the DataGrid
  const columns = [
    { field: 'KeyID', headerName: 'Key ID', flex: 1 },
    { field: 'KeyType', headerName: 'Key Type', flex: 1, editable: true },
    { field: 'Zone', headerName: 'Zone', flex: 1, editable: true },
    { field: 'KeyUsage', headerName: 'Key Usage', flex: 1 },
    { field: 'KeyName', headerName: 'Key Name', flex: 1, editable: true },
    { field: 'KeyDesc', headerName: 'Key Desc', flex: 4, editable: true },
    { field: 'KeyTag', headerName: 'Key Tag', flex: 1, editable: true },
    { field: 'TotalNumberOfKey', headerName: 'Total #', flex: 1, editable: true },
    { field: 'NumberOfSpareKey', headerName: 'Spare #', flex: 1 }
  ];

  // Update row data on changes
  const processRowUpdate = async (newRow, oldRow) => {
    if (JSON.stringify(newRow) === JSON.stringify(oldRow) || !newRow) {
      return oldRow;
    }

    try {
      await updateKey(newRow); // API call to update key
      toast.success("Row updated successfully!"); // Success message
      setTrigger(prev => !prev); // Refresh data
      return newRow;
    } catch (error) {
      toast.error(`Error: ${error.response.data}`); // Error message
      return oldRow;
    }
  };

  // Fetch rows data on component mount or when trigger changes
  useEffect(() => {
    const retrieveRows = async () => {
      try {
        const rows = await getKeys(); // API call to get keys
        setRows(rows);
      } catch (e) {
        console.error('Error retrieving rows:', e); // Error handling
      }
    };
    retrieveRows();
  }, [trigger]);

  return (
    <>
      <Box className="box-styles">
        <DataGrid
          rows={rows}
          columns={columns}
          className="table-styles"
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20
              },
            },
            sorting: {
              sortModel: [{ field: 'NumberOfSpareKey', sort: 'desc' }] // Default sorting by spare keys in descending order
            }
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          density="comfortable"
          getRowId={(row) => row.KeyID}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => {
            console.error('Error processing row update:', error); // Error logging
            alert('There was an error updating the row. Please try again.'); // User notification
          }}
          experimentalFeatures={{ newEditingApi: true }}
          onRowSelectionModelChange={handleSelectionChange} // Handle row selection
        />
        <SelectionActionBar 
          selectedRows={selectedRows} 
          setTrigger={setTrigger} 
          deleteType={deleteKey} // Action for deleting selected keys
        />
      </Box>
      <div>
        <AddKeyModal
          open={open}
          handleClose={() => setOpen(false)} // Close modal handler
          setTrigger={setTrigger}
        />
      </div>
    </>
  );
};

export default KeysTable;
