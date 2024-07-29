import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { Box, Button } from '@mui/material';
import './modal.css';
import { createNewKey } from '../../../api/apicommunicator';
import toast from 'react-hot-toast';

const AddKeyModal = ({ open, handleClose, setTrigger }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNewKey(formData);
      toast.success("Key created successfully!");
      handleClose();
    } catch (e) {
      if (e.response) {
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
        <h2 id="modal-title">Add New Key</h2>
        <form onSubmit={handleSubmit}>
          <Box>
            <Input
              id="KeyType"
              name="KeyType"
              value={formData.KeyType}
              onChange={handleChange}
              fullWidth
              className={`modal-input ${formData.KeyType ? 'has-text' : ''}`}
              disableUnderline
              required
            />
            <InputLabel htmlFor="KeyType" className="form-label">Key Type</InputLabel>
          </Box>
          <Box>
            <Input
              id="Zone"
              name="Zone"
              value={formData.Zone}
              onChange={handleChange}
              fullWidth
              className={`modal-input ${formData.Zone ? 'has-text' : ''}`}
              disableUnderline
              required
            />
            <InputLabel htmlFor="Zone" className="form-label">Zone</InputLabel>
          </Box>
          <Box>
            <Input
              id="KeyUsage"
              name="KeyUsage"
              value={formData.KeyUsage}
              onChange={handleChange}
              fullWidth
              className={`modal-input ${formData.KeyUsage ? 'has-text' : ''}`}
              disableUnderline
              required
            />
            <InputLabel htmlFor="KeyUsage" className="form-label">Key Usage</InputLabel>
          </Box>
          <Box>
            <Input
              id="KeyName"
              name="KeyName"
              value={formData.KeyName}
              onChange={handleChange}
              fullWidth
              className={`modal-input ${formData.KeyName ? 'has-text' : ''}`}
              disableUnderline
              required
            />
            <InputLabel htmlFor="KeyName" className="form-label">Key Name</InputLabel>
          </Box>
          <Box>
            <Input
              id="KeyDesc"
              name="KeyDesc"
              value={formData.KeyDesc}
              onChange={handleChange}
              fullWidth
              className={`modal-input ${formData.KeyDesc ? 'has-text' : ''}`}
              disableUnderline
              required
            />
            <InputLabel htmlFor="KeyDesc" className="form-label">Key Description</InputLabel>
          </Box>
          <Box>
            <Input
              id="KeyTag"
              name="KeyTag"
              value={formData.KeyTag}
              onChange={handleChange}
              fullWidth
              className={`modal-input ${formData.KeyTag ? 'has-text' : ''}`}
              disableUnderline
              required
            />
            <InputLabel htmlFor="KeyTag" className="form-label">Key Tag</InputLabel>
          </Box>
          <Box>
            <Input
              id="TotalNumberOfKey"
              name="TotalNumberOfKey"
              value={formData.TotalNumberOfKey}
              onChange={handleChange}
              fullWidth
              className="modal-input"
              disableUnderline
              type="number"
              required
            />
            <InputLabel htmlFor="TotalNumberOfKey" className="form-label-nonmoving">Total Number Of Keys</InputLabel>
          </Box>
          <Box>
            <Input
              id="NumberOfSpareKey"
              name="NumberOfSpareKey"
              value={formData.NumberOfSpareKey}
              onChange={handleChange}
              fullWidth
              className= "modal-input"
              disableUnderline
              type="number"
              required
            />
            <InputLabel htmlFor="NumberOfSpareKey" className="form-label-nonmoving">Number Of Spare Keys</InputLabel>
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

export default AddKeyModal;
