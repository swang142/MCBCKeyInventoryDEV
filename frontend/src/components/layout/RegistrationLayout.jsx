import React, { useState } from 'react';
import { InputLabel, Box, Input, Button } from '@mui/material';
import './PageLayout.css';
import { login, register } from '../../../api/apicommunicator';
import { useSignIn } from "react-auth-kit";
import { useNavigate } from 'react-router-dom';
import CodeValidationModal from '../modals/CodeValidationModal';
import toast from 'react-hot-toast';


const RegistrationLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isCodeValid, setIsCodeValid] = useState(false);

  const signIn = useSignIn();
  const navigate = useNavigate();

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleValidationSuccess = () => {
    setIsCodeValid(true);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      await register(username, password);
  
      const response = await login(username, password)

      if (signIn({
        token: response.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { username: username },
      })) {
        toast.success("Sucessfully logged in!")
        navigate('/');
      }
    } catch (e) {
      if (e.response) {
        toast.error(`Error: ${e.response.data.error}`); // Show error message from server
      } else {
        toast.error("An unexpected error occurred."); // Generic error message
      }
    }
  };

  return (
    <div className="form-background">
      <div className="form-container">
        <h2 className="form-title">Welcome! Please Register.  </h2>

        {!isCodeValid && (
          <CodeValidationModal
            open={isModalOpen}
            handleClose={handleModalClose}
            handleValidationSuccess={handleValidationSuccess}
          />
        )}

        {isCodeValid && (
          <form  onSubmit={handleSubmit}>
            <div className="form-elements">

              <Box className="form-text"> 
                <InputLabel> Username </InputLabel>

                <Input className='form-input'
                  id="username"
                  name="username"
                > </Input>
              </Box>

              <Box className="form-text"> 
                <InputLabel> Password </InputLabel>
                <Input className='form-input'
                  id="password"
                  name="password"
                  type="password"
                > </Input>
              </Box>

              <Button className="add-button" type= "submit">
              REGISTER
              </Button>

            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrationLayout;
