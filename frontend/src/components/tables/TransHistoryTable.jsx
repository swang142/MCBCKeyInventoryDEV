import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { deleteTransaction, getTransactionHistory, updateTransaction } from '../../../api/apicommunicator';
import SelectionActionBar from '../common/SelectionActionBar';
import './Table.css';
import AddTransactionModal from '../modals/AddTransactionModal';
import toast from 'react-hot-toast';

const TransactionHistoryTable = ({ open, setOpen }) => {
    const [rows, setRows] = useState([]); // State to hold the transaction data
    const [trigger, setTrigger] = useState(false); // State to trigger data refresh
    const [selectedRows, setSelectedRows] = useState([]); // State to manage selected rows

    // Handle changes in row selection
    const handleSelectionChange = (selectionModel) => {
        setSelectedRows(selectionModel);
    };

    // Define columns for the DataGrid
    const columns = [
        { field: 'HolderName', headerName: 'Holder Name', flex: 1 },
        { field: 'KeyID', headerName: 'Key ID', flex: 1, editable: true },
        { field: 'HolderID', headerName: 'Holder ID', flex: 1, editable: true },
        { 
            field: 'TransactionType', 
            headerName: 'Transaction Type', 
            flex: 1, 
            editable: true,
            type: 'singleSelect', // Dropdown selection for transaction types
            valueOptions: ['TAKE OUT', 'RETURN']
        },
        { 
            field: 'TransactionTimestamp', 
            headerName: 'Transaction Timestamp', 
            flex: 1,
            valueFormatter: (params) => 
                dayjs(params).format('DD/MM/YYYY @ HH:mm') // Format date using dayjs
        },
        { field: 'Count', headerName: 'Key Count', flex: 1, editable: true }
    ];

    // Handle updates to row data
    const processRowUpdate = async (newRow, oldRow) => { 
        if (JSON.stringify(newRow) === JSON.stringify(oldRow) || !newRow) {
            return oldRow;
        }
        try {
            await updateTransaction(newRow); // API call to update transaction
            setTrigger(prev => !prev); // Refresh data
            toast.success("Row updated successfully!"); // Success message
            return newRow;
        } catch (error) {
            toast.error(`Error: ${error.response.data}`); // Error message
            return oldRow;
        }
    };

    // Fetch transaction data on component mount or when trigger changes
    useEffect(() => {
        const retrieveRows = async () => {
            try {
                const data = await getTransactionHistory(); // API call to get transaction history
                setRows(data);
            } catch (error) {
                console.error('Error fetching transaction history:', error); // Error handling
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
                            paginationModel: { pageSize: 20 }, // Initial pagination setup
                        },
                        sorting: {
                            sortModel: [{ field: 'TransactionTimestamp', sort: 'desc' }] // Default sorting by timestamp in descending order
                        }
                    }}
                    pageSizeOptions={[5, 10, 20]}
                    disableRowSelectionOnClick
                    density="comfortable"
                    processRowUpdate={processRowUpdate} // Handle row updates
                    onProcessRowUpdateError={(error) => {
                        console.error('Error processing row update:', error); // Error logging
                        alert('There was an error updating the row. Please try again.'); // User notification
                    }}
                    experimentalFeatures={{ newEditingApi: true }}
                    checkboxSelection
                    onRowSelectionModelChange={handleSelectionChange} // Handle row selection changes
                />
                <SelectionActionBar selectedRows={selectedRows} setTrigger={setTrigger} deleteType={deleteTransaction} />
            </Box>

            <div>
                <AddTransactionModal 
                    open={open}
                    handleClose={() => setOpen(false)} // Close modal handler
                    setTrigger={setTrigger}
                />
            </div>
        </>
    );
};

export default TransactionHistoryTable;
