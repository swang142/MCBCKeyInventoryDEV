import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Box, Button, Input, InputLabel } from '@mui/material';
import './modal.css';
import { createNewKeyholder } from '../../../api/apicommunicator';
import toast from 'react-hot-toast';

const AddKeyholderModal = ({ open, handleClose, setTrigger }) => {
  // State to manage form input data
  const [formData, setFormData] = useState({
    holderName: '',
  });

  // Update formData state when input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { holderName } = formData;
    
    try {
      await createNewKeyholder(holderName); // API call to create keyholder
      toast.success("Keyholder created successfully!"); // Show success message
      handleClose(); // Close the modal
    } catch (e) {
      if (e.response) {
        toast.error(`Error: ${e.response.data}`); // Show error message
      }
    }
    setTrigger(prev => !prev); // Trigger refresh (e.g., to update a list)
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
        <h2 id="modal-title">Add New Keyholder</h2> {/* Modal title */}
        <form onSubmit={handleSubmit}>
          <Box>
            <Input
              id="holderName"
              name="holderName"
              value={formData.holderName}
              onChange={handleChange} // Update formData on input change
              fullWidth
              className={`modal-input ${formData.holderName ? 'has-text' : ''}`}
              disableUnderline
            />
            <InputLabel htmlFor="holderName" className="form-label">
              Holder Name
            </InputLabel>
          </Box>
          <Box className="actions-bar">
            <Button type="submit" className="submit-button">
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddKeyholderModal;
