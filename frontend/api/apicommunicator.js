import { computeOffsetLeft } from '@mui/x-data-grid/hooks/features/virtualization/useGridVirtualScroller';
import axios from 'axios';
// Set the base URL for all axios requests
axios.defaults.baseURL = "http://localhost:5000/api"


// Transaction History

// Fetch transaction history from the API
const getTransactionHistory = async () => {
    const response = await axios.get('/transactions/history');
    console.log(response.data)
    return response.data;
}

// Create a new transaction with given parameters
const createNewTransaction = async (a, b, c, d) => {
    try {
        await axios.post('/transactions/create', { keyID: a, holderID: b, type: c, count: d })
    } catch (e) {
        throw e;
    }
}

// Update an existing transaction with new details
const updateTransaction = async (newTransaction) => {
    const id = newTransaction.id;
    const key = newTransaction.KeyID;
    const holder = newTransaction.HolderID;
    const typ = newTransaction.TransactionType;
    const count = newTransaction.Count;

    try {    
        const response = await axios.put(`/transactions/update/${id}`, { keyID: key, holderID: holder, type: typ, count: count })
        console.log(response)
        return response
    } catch (e) {
        throw e;
    }
}

// Delete a transaction by its ID
const deleteTransaction = async (id) => {
    await axios.delete(`transactions/delete/${id}`)
}


// Keyholders

// Fetch all keyholders from the API
const getKeyholders = async () => {
    const response = await axios.get('/keyholders')
    return response.data;
}

// Create a new keyholder with the given name
const createNewKeyholder = async (holderName) => {
    await axios.post('/keyholders/create', { holderName })
}

// Update an existing keyholder with new details
const updateKeyholder = async (newKeyholder) => {
    try {
        const response = await axios.put(`/keyholders/update/${newKeyholder.HolderID}`, { holderName: newKeyholder.HolderName })
        console.log(response)
        return response
    } catch (e) {
        return new Error("error")
    }
}

// Delete a keyholder by their ID
const deleteKeyholder = async (holderID) => {
    await axios.delete(`keyholders/delete/${holderID}`)
}


// Keys

// Fetch all keys from the API
const getKeys = async () => {
    const response = await axios.get('/keys');
    return response.data;
}

// Create a new key with the given data
const createNewKey = async (keyData) => {
    const { KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey } = keyData;
    await axios.post('/keys/create', { KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey });
}

// Update an existing key with new details
const updateKey = async (newKey) => {
    const { KeyID, KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey } = newKey;
    try {
        const response = await axios.put(`/keys/update/${KeyID}`, { KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey });
        return response;
    } catch (e) {
        return new Error("error");
    }
}

// Delete a key by its ID
const deleteKey = async (keyID) => {
    await axios.delete(`/keys/delete/${keyID}`);
}

const login = async (username, password) => {
    const response = await axios.post('/users/login', {username, password});
    return response;
}

const register = async (username, password) => {
    const response = await axios.post('users/register', {username, password})
    return response;
}

const generateCode = async (username) => {
    const response = await axios.post('users/generate-code', {username})
    return response;
}

const validateCode = async (code) => {
    const response = await axios.post('users/validate-code', {code})
    return response;
}

// Export all functions for use in other modules
export { getTransactionHistory, createNewTransaction, updateTransaction, deleteTransaction, getKeyholders, createNewKeyholder,
    updateKeyholder, deleteKeyholder, getKeys, createNewKey, updateKey, deleteKey, login, register, generateCode, validateCode };
