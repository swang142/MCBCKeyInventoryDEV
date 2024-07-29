import React, { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import './Table.css'
import { deleteKeyholder, getKeyholders, updateKeyholder } from '../../../api/apicommunicator';
import SelectionActionBar from '../common/SelectionActionBar';
import AddKeyholderModal from '../modals/AddKeyholderModal';

const KeyholderTable = ({open, setOpen}) => {
    const [rows, setRows] = useState([]);
    const [trigger, setTrigger] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const handleSelectionChange = (selectionModel) => {
        setSelectedRows(selectionModel);
    };

    const columns = [
        { field: 'HolderID', headerName: 'Holder ID', flex: 1},
        { field: 'HolderName', headerName: 'Holder Name', flex: 1, editable: true},
    ]

    const processRowUpdate = async (newRow, oldRow) => { 
      if (JSON.stringify(newRow) === JSON.stringify(oldRow) || !newRow) {
        return oldRow;
      }
      
      try {
        await updateKeyholder(newRow);
        toast.success("Row updated successfully!")
        setTrigger(prev => !prev);
        return newRow;
      } catch (error) {
        toast.error(`Error: ${error.response.data}`)
        return oldRow;
      }
    }

    useEffect(() => {
      const retrieveRows = async () => {
        try{
          let rows = await getKeyholders();
          setRows(rows);
        }
        catch(e){
          return new Error();
        } 
      }
      retrieveRows();
    }, [trigger]);
    
    return (

      <>
        <Box className= "box-styles">
            <DataGrid
            rows = {rows}
            columns = {columns}
            className = 'table-styles'
            initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10
                  },
                },
              }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            disableRowSelectionOnClick
            density = {'comfortable'}
            getRowId={(row) => row.HolderID}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) => {
              console.error('Error processing row update:', error);
              alert('There was an error updating the row. Please try again.');
            }}
            experimentalFeatures={{ newEditingApi: true }}
            onRowSelectionModelChange={handleSelectionChange}
            />
            <SelectionActionBar selectedRows={selectedRows}  setTrigger={setTrigger} deleteType={deleteKeyholder} />
        </Box>
      <div>
          <AddKeyholderModal
                open= {open}
                handleClose= {() => {
                    setOpen(false);
                }}
                setTrigger= {setTrigger}
                />
      </div>
      </>

    )
}

export default KeyholderTable;