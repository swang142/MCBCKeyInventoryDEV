import React, { useState } from 'react';
import TransactionHistoryTable from '../tables/TransHistoryTable';
import KeyholderTable from '../tables/KeyholderTable';
import KeysTable from '../tables/KeysTable';
import { Typography, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AddTransactionModal from '../modals/AddTransactionModal';
import AddKeyModal from '../modals/AddKeyModal';
import AddKeyholderModal from '../modals/AddKeyholderModal';
import './PageLayout.css';

const PageLayout = () => {
  // State to track the currently active tab
  const [activeTab, setActiveTab] = useState(0);

  // States to manage modal visibility for adding entries
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [keyholderOpen, setKeyholderOpen] = useState(false);
  const [keysOpen, setKeysOpen] = useState(false);

  // Function to switch tabs based on tab index
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Function to render the content based on the active tab
  const renderTabContent = () => {
    // Render the appropriate table based on the active tab
    if (activeTab === 0) {
      return <TransactionHistoryTable key={`tab-${activeTab}`} setOpen={setTransactionOpen} open={transactionOpen} />;
    } else if (activeTab === 1) {
      return <KeyholderTable key={`tab-${activeTab}`} setOpen={setKeyholderOpen} open={keyholderOpen} />;
    } else if (activeTab === 2) {
      return <KeysTable key={`tab-${activeTab}`} setOpen={setKeysOpen} open={keysOpen} />;
    }
    return null;
  };

  return (
    <>
      <div className="tabs" style={{ '--activeTab': activeTab }}>
        {/* Tab navigation section */}
        <div
          id="transactions"
          className={`tab-section ${activeTab === 0 ? 'active' : ''}`} // Highlight the active tab
          onClick={() => handleTabClick(0)}
        >
          <Typography className="tab-label">Transaction History</Typography>
        </div>

        <div
          id="keyholders"
          className={`tab-section ${activeTab === 1 ? 'active' : ''}`} // Highlight the active tab
          onClick={() => handleTabClick(1)}
        >
          <Typography className="tab-label">Keyholders History</Typography>
        </div>

        <div
          id="keys"
          className={`tab-section ${activeTab === 2 ? 'active' : ''}`} // Highlight the active tab
          onClick={() => handleTabClick(2)}
        >
          <Typography className="tab-label">Keys History</Typography>
        </div>
        <div className="glider"></div> {/* Visual effect for tab navigation */}
      </div>

      <div id="tablesContainer">

        <section className="actions">
          {/* Button to open the appropriate modal based on the active tab */}
          <Button
            className="add-button"
            onClick={() => {
              if (activeTab === 0) {
                setTransactionOpen(true);
              } else if (activeTab === 1) {
                setKeyholderOpen(true);
              } else if (activeTab === 2) {
                setKeysOpen(true);
              }
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="icon-margin" /> Add
          </Button>
        </section>

        <section className="tab-content">
          <div className="tables">
            {renderTabContent()} {/* Render content based on the active tab */}
          </div>
        </section>
      </div>

      {/* Conditional rendering of modals based on their respective states */}
      {transactionOpen && <AddTransactionModal open={transactionOpen} handleClose={() => setTransactionOpen(false)} setTrigger={() => {}} />}
      {keyholderOpen && <AddKeyholderModal open={keyholderOpen} handleClose={() => setKeyholderOpen(false)} setTrigger={() => {}} />}
      {keysOpen && <AddKeyModal open={keysOpen} handleClose={() => setKeysOpen(false)} setTrigger={() => {}} />}
    </>
  );
};

export default PageLayout;
