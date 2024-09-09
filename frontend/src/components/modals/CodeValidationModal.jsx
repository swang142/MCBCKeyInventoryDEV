import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Button, Input, InputLabel } from '@mui/material';
import './modal.css';
import toast from 'react-hot-toast';
import { validateCode } from '../../../api/apicommunicator';
import Header from '../common/Header';
import { useNavigate } from 'react-router-dom';


const CodeValidationModal = ({ open, handleClose, handleValidationSuccess }) => {

  const navigate = useNavigate();

  // State to manage form input data
  const [formData, setFormData] = useState({
    accessCode: '',
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
    const { accessCode } = formData;
    
    try {
      await validateCode(accessCode); // API call to validate code
      toast.success("Code validated successfully!"); // Show success message
      handleValidationSuccess(); // Notify parent component that validation was successful
      handleClose(); // Close the modal
      
    } catch (e) {
      if (e.response) {
        toast.error(`Error: ${e.response.data.error}`); // Show error message from server
      } else {
        toast.error("An unexpected error occurred."); // Generic error message
      }
    }
  };

  return (
    
    <Modal
      open={open} // Control modal visibility
      onClose={(e, reason) => {
        if (reason !== 'backdropClick') {
          handleClose();
        }
      }} // Prevent modal from closing on backdrop click
      disableEscapeKeyDown // Disable closing with the escape key
      aria-labelledby="modal-title" // Accessible title
      aria-describedby="modal-description" // Accessible description
      className="modal" // Custom styling for the modal
    >
      <Box className="modal-container">
        <button className="close-button" onClick={() => { navigate('/') }}>×</button> {/* Close button */}
        <h2 id="modal-title">Enter Access Code</h2> {/* Modal title */}
        <form onSubmit={handleSubmit}>
          <Box>
            <Input
              id="accessCode"
              name="accessCode"
              value={formData.accessCode}
              onChange={handleChange} // Update formData on input change
              fullWidth
              className={`modal-input ${formData.accessCode ? 'has-text' : ''}`}
              disableUnderline
            />
            <InputLabel htmlFor="accessCode" className="form-label">
              Access Code
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

export default CodeValidationModal;
