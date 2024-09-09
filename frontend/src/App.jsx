import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/theme.css'
import TransactionHistoryTable from './components/tables/TransHistoryTable'
import KeyholderTable from './components/tables/KeyholderTable'
import KeysTable from './components/tables/KeysTable'
import PageLayout from './components/layout/PageLayout'
import AddModal from './components/modals/AddTransactionModal'
import Footer from './components/common/Footer'
import Header from './components/common/Header'
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Router, RouterProvider, Routes, createBrowserRouter } from 'react-router-dom'
import LoginLayout from './components/layout/LoginLayout'
import { RequireAuth } from 'react-auth-kit'
import RegistrationLayout from './components/layout/RegistrationLayout'

function App() {
  return (
    <>  
      <BrowserRouter>
        <Header /> 
          <Routes>
            <Route path="/" element={ <RequireAuth loginPath="/login"> <PageLayout /> </RequireAuth> }> </Route>
            <Route path="/login" element = {<LoginLayout/>}></Route>
            <Route path="/register" element = {<RegistrationLayout/>}></Route>
          </Routes>
        <Footer />
      </BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>
  )
}

export default App
