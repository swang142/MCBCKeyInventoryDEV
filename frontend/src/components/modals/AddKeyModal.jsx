import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { Box, Button } from '@mui/material';
import './modal.css';
import { createNewKey } from '../../../api/apicommunicator';
import toast from 'react-hot-toast';

const AddKeyModal = ({ open, handleClose, setTrigger }) => {
  // State to manage form input data
  const [formData, setFormData] = useState({
    KeyType: '',
    Zone: '',
    KeyUsage: '',
    KeyName: '',
    KeyDesc: '',
    KeyTag: '',
    TotalNumberOfKey: '',
    NumberOfSpareKey: ''
  });

  // Update formData state when input changes
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
    try {
      await createNewKey(formData); // API call to create new key
      toast.success("Key created successfully!"); // Show success message
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
        <h2 id="modal-title">Add New Key</h2> {/* Modal title */}
        <form onSubmit={handleSubmit}>
          {/* Render form fields dynamically based on formData */}
          {Object.keys(formData).map((key) => (
            <Box key={key}>
              <Input
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange} // Update formData on input change
                fullWidth
                className={`modal-input ${formData[key] ? 'has-text' : ''}`}
                disableUnderline
                type={key.includes('Number') ? 'number' : 'text'} // Set input type based on field name
                required // Make field required
              />
              <InputLabel htmlFor={key} className={`form-label${key.includes('Number') ? '-nonmoving' : ''}`}>
                {/* Format label text to be more readable */}
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </InputLabel>
            </Box>
          ))}
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

export default AddKeyModal;
