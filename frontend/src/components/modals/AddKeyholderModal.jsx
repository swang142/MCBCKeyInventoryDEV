import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Box, Button, Input } from '@mui/material';
import './modal.css';
import { createNewKeyholder } from '../../../api/apicommunicator';
import toast from 'react-hot-toast';

const AddKeyholderModal = ({ open, handleClose, setTrigger }) => {
  const [formData, setFormData] = useState({
    holderName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const holderName = formData['holderName'];
    
    try {
      await createNewKeyholder(holderName);
      toast.success("Keyholder created successfully!");
      handleClose();
    } catch (e) {
      if (e.response) {
        toast.error(`Error: ${e.response.data}`);
      }
    }
    setTrigger((prev) => !prev);
    console.log('New keyholder added:', formData);
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
        <h2 id="modal-title">Add New Keyholder</h2>
        <form onSubmit={handleSubmit}>
          <Box>
            <Input
              id="holderName"
              name="holderName"
              value={formData.holderName}
              onChange={handleChange}
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
