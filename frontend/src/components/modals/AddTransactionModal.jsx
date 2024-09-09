import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Box, Button } from '@mui/material';
import './modal.css';
import { createNewTransaction } from '../../../api/apicommunicator';
import toast from 'react-hot-toast';

const AddTransactionModal = ({ open, handleClose, setTrigger }) => {
  // State to manage form data
  const [formData, setFormData] = useState({
    keyid: '',
    holderid: '',
    transactionType: '',
    keyCount: 1
  });

  // Update form data state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { keyid, holderid, transactionType, keyCount } = formData;
    
    try {
      await createNewTransaction(keyid, holderid, transactionType, keyCount); // API call to create new transaction
      toast.success("Transaction created successfully!"); // Show success message
      handleClose(); // Close the modal
    } catch (e) {
      if (e.response) {
        toast.error(`Error: ${e.response.data}`); // Show error message
      }
    }
    setTrigger(prev => !prev); // Refresh trigger (e.g., to update a list)
  };

  return (
    <Modal
      open={open} // Control modal visibility
      onClose={handleClose} // Close modal handler
      aria-labelledby="modal-title" // Accessible title
      aria-describedby="modal-description" // Accessible description
      className="modal" // Custom styling for the modal
    >
      <Box className="modal-container">
        <button className="close-button" onClick={handleClose}>×</button> {/* Close button */}
        <h2 id="modal-title">Add New Transaction</h2> {/* Modal title */}
        <form onSubmit={handleSubmit}>
          <Box>
            <Input
              id="keyid"
              name="keyid"
              value={formData.keyid}
              onChange={handleChange} // Update formData on input change
              fullWidth
              className={`modal-input ${formData.keyid ? 'has-text' : ''}`}
              disableUnderline
            />
            <InputLabel htmlFor="keyid" className="form-label">Key ID</InputLabel>
          </Box>
          <Box>
            <Input
              id="holderid"
              name="holderid"
              value={formData.holderid}
              onChange={handleChange} // Update formData on input change
              fullWidth
              className={`modal-input ${formData.holderid ? 'has-text' : ''}`}
              disableUnderline
            />
            <InputLabel htmlFor="holderid" className="form-label">Holder ID</InputLabel>
          </Box>

          <Box className="dropdown-menu">
            <Select
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange} // Update formData on selection change
              label="Transaction Type"
              className="modal-input"
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
              onChange={handleChange} // Update formData on input change
              fullWidth
              className="modal-input"
              disableUnderline
              type="number" // Numeric input type for count
              required
              inputProps={{ min: 1 }} // Set minimum value for keyCount
            />
            <InputLabel htmlFor="keyCount" className="form-label-nonmoving">Count</InputLabel>
          </Box>

          <Box className="actions-bar">
            <Button type="submit" className="submit-button" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddTransactionModal;
