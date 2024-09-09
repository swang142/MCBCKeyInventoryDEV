import { Router } from "express";
import FacilityKeyTransaction from "../models/keyTransactionModel.js";
import FacilityKey from "../models/keyModel.js";
import Keyholder from "../models/keyholderModel.js";

const transactionRoutes = Router();

// Get transaction history
transactionRoutes.get('/history', async (req, res) => {
    try {
        const transactions = await FacilityKeyTransaction.findAll(); // Fetch all transactions
        res.json(transactions); // Send the result as JSON
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).json({ error: "Could not get transactions", details: e.message }); // Send error response
    }
});

// Create a new transaction
transactionRoutes.post('/create', async (req, res) => {

    const { keyID, holderID, type, count } = req.body;

    if (!keyID || !holderID || !type || count === undefined) {
        return res.status(400).send('Fields cannot be blank'); // Validate required fields
    }

    try {
        const facilityKey = await FacilityKey.findByPk(keyID); // Find the key by primary key
        if (!facilityKey) return res.status(404).send('Key not found'); // Handle if key not found

        // Check for TAKE OUT or RETURN transactions
        if (type === 'TAKE OUT' && facilityKey.NumberOfSpareKey < count) {
            return res.status(400).send('Not enough spare keys available');
        } else if (type === 'RETURN' && count + facilityKey.NumberOfSpareKey > facilityKey.TotalNumberOfKey) {
            return res.status(400).send('You have attempted to return too many keys');
        }

        const holderElement = await Keyholder.findByPk(holderID);
        const holderName = holderElement.dataValues.HolderName
        console.log(holderName)

        // Insert new transaction
        const newTransaction = await FacilityKeyTransaction.create({
            KeyID: keyID,
            HolderName: holderName,
            HolderID: holderID,
            TransactionType: type,
            Count: count
        });

        // Update the spare keys count
        if (type === 'TAKE OUT') {
            facilityKey.NumberOfSpareKey -= count;
        } else if (type === 'RETURN') {
            facilityKey.NumberOfSpareKey += count;
        }

        await facilityKey.save(); // Save the updated facility key record

        res.json({ add: newTransaction, message: 'Creation successful' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Could not add transaction", details: e.message });
    }
});

// Update an existing transaction
transactionRoutes.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { keyID, holderID, type, count } = req.body;

    if (!id || !keyID || !holderID || !type || count === undefined) {
        return res.status(400).send('Fields cannot be blank');
    }

    try {
        const transaction = await FacilityKeyTransaction.findByPk(id); // Find transaction by primary key
        const facilityKey = await FacilityKey.findByPk(keyID); // Find the key by primary key

        if (!transaction || !facilityKey) {
            return res.status(404).send('Transaction or Key not found');
        }

        const originalType = transaction.TransactionType;
        const originalCount = transaction.Count;

        // Adjust spare keys based on the original transaction
        if (originalType === 'TAKE OUT') {
            facilityKey.NumberOfSpareKey += originalCount;
        } else if (originalType === 'RETURN') {
            facilityKey.NumberOfSpareKey -= originalCount;
        }

        // Handle new transaction type
        if (type === 'TAKE OUT' && facilityKey.NumberOfSpareKey < count) {
            return res.status(400).send('Not enough spare keys available');
        } else if (type === 'RETURN' && count + facilityKey.NumberOfSpareKey > facilityKey.TotalNumberOfKey) {
            return res.status(400).send('You have attempted to return too many keys');
        }

        // Update spare key count for the new transaction type
        if (type === 'TAKE OUT') {
            facilityKey.NumberOfSpareKey -= count;
        } else if (type === 'RETURN') {
            facilityKey.NumberOfSpareKey += count;
        }

        await facilityKey.save(); // Save the updated facility key record

        // Update the transaction record
        await transaction.update({
            KeyID: keyID,
            HolderID: holderID,
            TransactionType: type,
            Count: count
        });

        res.json({ updated: transaction, message: 'Update successful' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Could not update transaction", details: e.message });
    }
});

// Delete a transaction
transactionRoutes.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const transaction = await FacilityKeyTransaction.findByPk(id); // Find transaction by primary key
        if (!transaction) return res.status(404).send('Transaction not found');

        const facilityKey = await FacilityKey.findByPk(transaction.KeyID); // Find the key by primary key
        if (!facilityKey) return res.status(404).send('Key not found');

        // Adjust the spare keys count based on the transaction type
        if (transaction.TransactionType === 'TAKE OUT') {
            facilityKey.NumberOfSpareKey += transaction.Count;
        } else if (transaction.TransactionType === 'RETURN') {
            facilityKey.NumberOfSpareKey -= transaction.Count;
        }

        await facilityKey.save(); // Save the updated facility key record
        await transaction.destroy(); // Delete the transaction record

        res.json({ message: 'Record deleted successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Could not delete transaction", details: e.message });
    }
});

export default transactionRoutes;
