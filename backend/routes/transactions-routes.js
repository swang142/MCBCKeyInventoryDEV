import { Router } from "express";
import { connectToDB } from "../db/connection.js";

const transactionRoutes = Router();

transactionRoutes.get('/history', async (req, res) => {
    let connection;
    try {
        connection = await connectToDB();
        const response = await connection.promise().query("SELECT * FROM facilitykeytransactions");
        res.json(response[0]);
    }
    catch(e){
        return new Error("could not get transactions");
    }
    finally{
        if (connection) await connection.end();
    }
});

transactionRoutes.post('/create', async (req, res) => {
    const { keyID, holderID, type, count } = req.body;

    console.log({ keyID, holderID, type, count });

    if (!keyID || !holderID || !type || count === undefined) {
        return res.status(400).send('Fields cannot be blank');
    }

    let connection;
    try {
        connection = await connectToDB();
        
        // Check if enough spare keys are available for TAKE OUT
        if (type === 'TAKE OUT') {
            const [keyData] = await connection.promise().query("SELECT NumberOfSpareKey FROM facilitykeys WHERE KeyID = ?", [keyID]);
            if ( keyData[0].NumberOfSpareKey < count) {
                return res.status(400).send('Not enough spare keys available');
            }
        }
        else if (type === 'RETURN') {
            const [keyData] = await connection.promise().query("SELECT * FROM facilitykeys WHERE KeyID = ?", [keyID]);
            if(count + keyData[0].NumberOfSpareKey > keyData[0].TotalNumberOfKey){
                return res.status(400).send('You have attempted to return too many keys');
            }
        }

        const [holderElement] = await connection.promise().execute("SELECT holderName FROM keyholders WHERE HolderID = ?", [holderID])
        const holderName = holderElement[0].holderName
        
        const query = "INSERT INTO facilitykeytransactions (HolderName, KeyID, HolderID, TransactionType, Count) VALUES (?, ?, ?, ?, ?)";
        await connection.promise().execute(query, [holderName, keyID, holderID, type, count]);

        // Update the spare keys count
        const updateQuery = type === 'TAKE OUT' ? 
            "UPDATE facilitykeys SET NumberOfSpareKey = NumberOfSpareKey - ? WHERE KeyID = ?" : 
            "UPDATE facilitykeys SET NumberOfSpareKey = NumberOfSpareKey + ? WHERE KeyID = ?";
        await connection.promise().execute(updateQuery, [count, keyID]);

        res.json({ add: { holderID, keyID, type, count }, message: 'Creation successful' });
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).json({ error: "Could not add transaction", details: e.message });
    } finally {
        if (connection) await connection.end();
    }
});

transactionRoutes.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { keyID, holderID, type, count } = req.body;
    
    if (!id || !keyID || !holderID || !type || count === undefined) {
        return res.status(400).send('Fields cannot be blank');
    }

    let connection;
    try {
        connection = await connectToDB();

        // Since updating may change the type or count, you need to adjust the NumberOfSpareKey accordingly
        // Fetch the original transaction
        const [originalTransaction] = await connection.promise().query("SELECT * FROM facilitykeytransactions WHERE id = ?", [id]);
        const originalType = originalTransaction[0].TransactionType;
        const originalCount = originalTransaction[0].Count;

        const [keyLookup] = await connection.promise().query("SELECT * FROM facilitykeys WHERE KeyID = ?", [keyID])
        const spareKeyNumber = keyLookup[0].NumberOfSpareKey;
        const totalKeyNumber = keyLookup[0].TotalNumberOfKey;

        let resetKeyNum;

        if (originalType === 'TAKE OUT'){
            resetKeyNum = spareKeyNumber + originalCount;
        } else if (originalType === 'RETURN') {
            resetKeyNum = spareKeyNumber - originalCount;
        }

        if ( type === 'TAKE OUT') {
            const newKeyNum = resetKeyNum - count;
            if(newKeyNum < 0){
                return res.status(400).send('Not enough spare keys available');
            } else {
                await connection.promise().execute("UPDATE facilitykeys SET NumberOfSpareKey =  ? WHERE KeyID = ?", [newKeyNum, keyID]);
            }
        } else if (type === 'RETURN'){
            const newKeyNum = resetKeyNum + count;
            if(newKeyNum > totalKeyNumber) {
                return res.status(400).send('You have attempted to return too many keys');
            } else {
                await connection.promise().execute("UPDATE facilitykeys SET NumberOfSpareKey = ? WHERE KeyID = ?", [newKeyNum, keyID]);
            }
        }
        

        const query = "UPDATE facilitykeytransactions SET KeyID = ?, HolderID = ?, TransactionType = ?, Count = ? WHERE id = ?";
        await connection.promise().execute(query, [keyID, holderID, type, count, id]);

        res.json({ updated: { id, holderID, keyID, type, count }, message: 'Update successful' });
    } catch (e) {   
        console.error(e); // Log the error for debugging
        res.status(500).json({ error: "Could not update transaction", details: e.message });
    } finally {
        if (connection) await connection.end();
    }
});

transactionRoutes.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    let connection;
    try {
        connection = await connectToDB();

        // Fetch the original transaction before deleting
        const [originalTransaction] = await connection.promise().query("SELECT * FROM facilitykeytransactions WHERE id = ?", [id]);

        const query = "DELETE FROM facilitykeytransactions WHERE id = ?";
        await connection.promise().execute(query, [id]);

        if (originalTransaction.length) {
            const { KeyID, TransactionType, Count } = originalTransaction[0];
            
            if (TransactionType === 'TAKE OUT') {
                await connection.promise().execute("UPDATE facilitykeys SET NumberOfSpareKey = NumberOfSpareKey + ? WHERE KeyID = ?", [Count, KeyID]);
            } else if (TransactionType === 'RETURN') {
                await connection.promise().execute("UPDATE facilitykeys SET NumberOfSpareKey = NumberOfSpareKey - ? WHERE KeyID = ?", [Count, KeyID]);
            }
        }

        res.json({ message: 'Record deleted successfully' });
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).json({ error: "Could not delete transaction", details: e.message });
    } finally {
        if (connection) await connection.end();
    }
});

export default transactionRoutes;
