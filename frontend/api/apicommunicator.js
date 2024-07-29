import axios from 'axios';
axios.defaults.baseURL = "http://localhost:3000/api"


// Transaction History
const getTransactionHistory = async () => {
    const response = await axios.get('/transactions/history');

    return response.data;
}

const createNewTransaction = async (a, b, c, d) => {
    try {
        await axios.post('/transactions/create', {keyID: a, holderID: b, type: c, count: d})
    }
    catch(e){
        throw e;
    }
}

const updateTransaction = async (newTransaction) => {
    const id = newTransaction.id;
    const key = newTransaction.KeyID;
    const holder = newTransaction.HolderID;
    const typ = newTransaction.TransactionType;
    const count = newTransaction.Count;

    try{    
        const response = await axios.put(`/transactions/update/${id}`, {keyID: key, holderID: holder, type: typ, count: count})
        console.log(response)
        return response
    }
    catch(e) {
        throw e;
    }
}

const deleteTransaction = async (id) => {
    await axios.delete(`transactions/delete/${id}`)
}


// Keyholders

const getKeyholders= async () => {
    const response = await axios.get('/keyholders')
    return response.data;
}

const createNewKeyholder = async (holderName) => {
    await axios.post('/keyholders/create', holderName )
}

const updateKeyholder = async (newKeyholder) => {

    try{
        const response = await axios.put(`/keyholders/update/${newKeyholder.HolderID}`, {holderName: newKeyholder.HolderName})
        return response
    }
    catch(e) {
        return new Error("error")
    }
}

const deleteKeyholder = async (holderID) => {
    await axios.delete(`keyholders/delete/${holderID}`)
}

// Keys
const getKeys = async () => {
    const response = await axios.get('/keys');
    return response.data;
}


const createNewKey = async (keyData) => {
    const { KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey } = keyData;
    await axios.post('/keys/create', { KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey });
}

const updateKey = async (newKey) => {
    const {KeyID, KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey } = newKey;
    try {
        const response = await axios.put(`/keys/update/${KeyID}`, { KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey });
        return response;
    } catch (e) {
        return new Error("error");
    }
}

const deleteKey = async (keyID) => {
    await axios.delete(`/keys/delete/${keyID}`);
}


export { getTransactionHistory, createNewTransaction, updateTransaction, deleteTransaction, getKeyholders, createNewKeyholder,
    updateKeyholder, deleteKeyholder, getKeys, createNewKey, updateKey, deleteKey};