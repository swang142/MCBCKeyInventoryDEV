import React, { useState } from 'react'
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Box, Button, Input } from '@mui/material';
import './modal.css';
import { createNewTransaction, getKeys } from '../../../api/apicommunicator';
import toast from 'react-hot-toast';

const AddTransactionModal = ({open, handleClose, setTrigger}) => {

  const [formData, setFormData] = useState({
    keyid: '',
    holderid: '',
    transactionType: '',
    keyCount: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
    const keyID = formData['keyid'];
    const holderID = formData['holderid'];
    const transactionType = formData['transactionType'];
    const keyCount = formData['keyCount'];
    
    try{ 
      const result = await createNewTransaction(keyID, holderID, transactionType, keyCount);
      toast.success("Transaction created successfully!")
      handleClose();
    }
    catch (e){
      if(e.response){
        toast.error(`Error: ${e.response.data}`);
      }
    }
    setTrigger(prev => !prev);

  };

  return (
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="modal"
    >
       <Box className="modal-container">
            <button className="close-button" onClick={handleClose}>×</button>
            <h2 id="modal-title"> Add New Transaction</h2>
            <form onSubmit={handleSubmit}>
              <Box>
              <Input
                  id="keyid"
                  name="keyid"
                  value={formData.keyid}
                  onChange={handleChange}
                  fullWidth
                  className= {`modal-input ${formData.keyid ? 'has-text' : ''}`}
                  disableUnderline
                />
                <InputLabel htmlFor="keyid" className="form-label">Key ID</InputLabel>
              </Box>
              <Box>
                <Input
                  id="holderid"
                  name="holderid"
                  value={formData.holderid}
                  onChange={handleChange}
                  fullWidth
                  className= {`modal-input ${formData.holderid ? 'has-text' : ''}`}
                  disableUnderline
                />
                <InputLabel htmlFor="holderid" className="form-label">Holder ID</InputLabel>
              </Box>

              <Box className= "dropdown-menu"> 
                <Select
                  name="transactionType"
                  value={formData.transactionType}
                  onChange={handleChange}
                  label="Transaction Type"
                  className = 'modal-input'
                >
                  <MenuItem value="TAKE OUT">TAKE OUT</MenuItem>
                  <MenuItem value="RETURN">RETURN</MenuItem>
                </Select>
                <InputLabel className="form-label-nonmoving">Transaction Type</InputLabel>
              </Box>

              <Box>
                <Input
                  id="count"
                  name="keyCount"
                  value={formData.keyCount}
                  onChange={handleChange}
                  fullWidth
                  className="modal-input"
                  disableUnderline
                  type="number"
                  required
                  inputProps={{ min: 1 }} 
                />
                <InputLabel htmlFor="keyCount" className="form-label-nonmoving">Count</InputLabel>
              </Box>

            <Box className="actions-bar" >
              <Button type="submit" className= "submit-button">
                Submit  
              </Button>
            </Box>  
          </form>
       </Box>
    </Modal>
  )
}

export default AddTransactionModal;