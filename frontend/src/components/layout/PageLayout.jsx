import React, { useState } from 'react';
import TransactionHistoryTable from '../tables/TransHistoryTable';
import KeyholderTable from '../tables/KeyholderTable';
import KeysTable from '../tables/KeysTable';
import { Typography, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AddModal from '../modals/AddTransactionModal';
import './PageLayout.css';

const PageLayout = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [keyholderOpen, setKeyholderOpen] = useState(false);
  const [keysOpen, setKeysOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
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
        <div
          id="transactions"
          className={`tab-section ${activeTab === 0 ? 'active' : ''}`}
          onClick={() => handleTabClick(0)}
        >
          <Typography className="tab-label">Transaction History</Typography>
        </div>

        <div
          id="keyholders"
          className={`tab-section ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => handleTabClick(1)}
        >
          <Typography className="tab-label">Keyholders History</Typography>
        </div>

        <div
          id="keys"
          className={`tab-section ${activeTab === 2 ? 'active' : ''}`}
          onClick={() => handleTabClick(2)}
        >
          <Typography className="tab-label">Keys History</Typography>
        </div>
        <div className="glider"></div>
      </div>

      <div id="tablesContainer">
        <div className="actions">
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
        </div>

        <section className="tab-content">
          <div className="tables">
            {renderTabContent()}
          </div>
        </section>
      </div>
    </>
  );
};

export default PageLayout;
