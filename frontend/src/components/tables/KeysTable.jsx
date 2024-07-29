import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import './Table.css';
import { deleteKey, getKeys, updateKey } from '../../../api/apicommunicator';
import SelectionActionBar from '../common/SelectionActionBar';
import AddKeyModal from '../modals/AddKeyModal';

const KeysTable = ({open, setOpen}) => {
  const [rows, setRows] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChange = (selectionModel) => {
      setSelectedRows(selectionModel);
  };

  const columns = [
    { field: 'KeyID', headerName: 'Key ID', flex: 1},
    { field: 'KeyType', headerName: 'Key Type', flex: 1, editable: true },
    { field: 'Zone', headerName: 'Zone', flex: 1 , editable: true  },
    { field: 'KeyUsage', headerName: 'Key Usage', flex: 1 },
    { field: 'KeyName', headerName: 'Key Name', flex: 1, editable: true },
    { field: 'KeyDesc', headerName: 'Key Desc', flex: 4, editable: true  },
    { field: 'KeyTag', headerName: 'Key Tag', flex: 1, editable: true  },
    { field: 'TotalNumberOfKey', headerName: 'Total #', flex: 1, editable: true  },
    { field: 'NumberOfSpareKey', headerName: "Spare #", flex: 1}
  ];

  const processRowUpdate = async (newRow, oldRow) => {
    if (JSON.stringify(newRow) === JSON.stringify(oldRow) || !newRow) {
      return oldRow;
    }

    try {
      await updateKey(newRow);
      toast.success("Row updated successfully!")
      setTrigger(prev => !prev);
      return newRow;
    } catch (error) {
      toast.error(`Error: ${error.response.data}`)
      return oldRow;
    }

  };

  useEffect(() => {
    const retrieveRows = async () => {
      try {
        const rows = await getKeys();
        setRows(rows);
      } catch (e) {
        console.error('Error retrieving rows:', e);
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
                pageSize: 10
              },
            },
            sorting: {
              sortModel: [{ field: 'NumberOfSpareKey', sort: 'desc' }]
            }
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableRowSelectionOnClick
          density="comfortable"
          getRowId={(row) => row.KeyID}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => {
            console.error('Error processing row update:', error);
            alert('There was an error updating the row. Please try again.');
          }}
          experimentalFeatures={{ newEditingApi: true }}
          onRowSelectionModelChange={handleSelectionChange}
        />
        <SelectionActionBar selectedRows={selectedRows} setTrigger={setTrigger} deleteType= {deleteKey}/>
      </Box>
      <div>
          <AddKeyModal
                open= {open}
                handleClose= {() => {
                    setOpen(false);
                }}
                setTrigger= {setTrigger}
                />
      </div>
    </>
          
  );
};

export default KeysTable;
