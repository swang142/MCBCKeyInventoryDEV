import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import './Table.css';
import { deleteKeyholder, getKeyholders, updateKeyholder } from '../../../api/apicommunicator';
import SelectionActionBar from '../common/SelectionActionBar';
import AddKeyholderModal from '../modals/AddKeyholderModal';
import toast from 'react-hot-toast';

const KeyholderTable = ({ open, setOpen }) => {
    const [rows, setRows] = useState([]); // State for table rows
    const [trigger, setTrigger] = useState(false); // Trigger to refresh data
    const [selectedRows, setSelectedRows] = useState([]); // State for selected rows

    // Handle row selection changes
    const handleSelectionChange = (selectionModel) => {
        setSelectedRows(selectionModel);
    };

    // Columns configuration for DataGrid
    const columns = [
        { field: 'HolderID', headerName: 'Holder ID', flex: 1 },
        { field: 'HolderName', headerName: 'Holder Name', flex: 1, editable: true },
    ];

    // Update row data on changes
    const processRowUpdate = async (newRow, oldRow) => {
        if (JSON.stringify(newRow) === JSON.stringify(oldRow) || !newRow) {
            return oldRow;
        }
        
        try {
            await updateKeyholder(newRow); // API call to update keyholder
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
                const rows = await getKeyholders(); // API call to get keyholders
                setRows(rows);
            } catch (e) {
                console.error('Error fetching keyholders:', e); // Error handling
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
                    className='table-styles'
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 20
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 20]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    density='comfortable'
                    getRowId={(row) => row.HolderID}
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
                    deleteType={deleteKeyholder} 
                />
            </Box>
            <div>
                <AddKeyholderModal
                    open={open}
                    handleClose={() => setOpen(false)} // Close modal handler
                    setTrigger={setTrigger}
                />
            </div>
        </>
    );
};

export default KeyholderTable;
