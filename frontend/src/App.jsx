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

function App() {
  return (
    <>
      <Header /> 
      <PageLayout />
      <Footer />
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>
  )
}

export default App
