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
    const [rows, setRows] = useState([]);
    const [trigger, setTrigger] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const handleSelectionChange = (selectionModel) => {
        setSelectedRows(selectionModel);
    };

    const columns = [
        { field: 'HolderName', headerName: 'Holder Name', flex: 1 },
        { field: 'KeyID', headerName: 'Key ID', flex: 1, editable: true },
        { field: 'HolderID', headerName: 'Holder ID', flex: 1, editable: true },
        { 
            field: 'TransactionType', 
            headerName: 'Transaction Type', 
            flex: 1, 
            editable: true,
            type: 'singleSelect',
            valueOptions: ['TAKE OUT', 'RETURN']  
        },
        { 
            field: 'TransactionTimestamp', 
            headerName: 'Transaction Timestamp', 
            flex: 1,
            valueFormatter: (params) => 
                dayjs(params).format('DD/MM/YYYY @ HH:mm')
        },
        { field: 'Count', headerName: 'Key Count', flex: 1, editable: true }
    ];

    const processRowUpdate = async (newRow, oldRow) => { 
        if (JSON.stringify(newRow) === JSON.stringify(oldRow) || !newRow) {
            return oldRow;
        }
        try {
            await updateTransaction(newRow);
            setTrigger(prev => !prev);
            toast.success("Row updated successfully!")
            return newRow;
        } catch (error) {
            toast.error(`Error: ${error.response.data}`)
            return oldRow;
        }
    };

    useEffect(() => {
        const retrieveRows = async () => {
            try {
                const data = await getTransactionHistory();
                setRows(data);
            } catch (error) {
                console.error('Error fetching transaction history:', error);
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
                            paginationModel: { pageSize: 10 },
                        },
                        sorting: {
                            sortModel: [{ field: 'TransactionTimestamp', sort: 'desc' }]
                        }
                    }}
                    pageSizeOptions={[5, 10]}
                    disableRowSelectionOnClick
                    density="comfortable"
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={(error) => {
                        console.error('Error processing row update:', error);
                        alert('There was an error updating the row. Please try again.');
                    }}
                    experimentalFeatures={{ newEditingApi: true }}
                    checkboxSelection
                    onRowSelectionModelChange={handleSelectionChange}
                />
                <SelectionActionBar selectedRows={selectedRows} setTrigger={setTrigger} deleteType={deleteTransaction} />
            </Box>

            <div>
                <AddTransactionModal 
                    open={open}
                    handleClose={() => setOpen(false)}
                    setTrigger={setTrigger}
                />
            </div>
        </>
    );
};

export default TransactionHistoryTable;
