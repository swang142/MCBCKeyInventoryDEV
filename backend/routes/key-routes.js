import { Router } from "express";
import { connectToDB } from "../db/connection.js";

const keyRoutes = Router();

keyRoutes.get('', async (req, res) => {
    let connection;
    try {
        connection = await connectToDB();
        const [rows] = await connection.promise().query("SELECT * FROM facilitykeys");
        res.json(rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Could not get keys", details: e.message });
    } finally {
        if (connection) await connection.end();
    }
});

keyRoutes.post('/create', async (req, res) => {
    const { KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey } = req.body;

    if (!KeyType || !Zone || !KeyUsage || !KeyName) {
        return res.status(400).send('Required fields cannot be blank');
    }

    let connection; 
    try {
        connection = await connectToDB();
        const query = "INSERT INTO facilitykeys (KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await connection.execute(query, [KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey]);
        res.json({ add: { KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey }, message: 'Creation successful' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Could not add key", details: e.message });
    } finally {
        if (connection) await connection.end();
    }
});

keyRoutes.put('/update/:keyID', async (req, res) => {
    const { keyID } = req.params;
    const { KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey } = req.body;

    if (!keyID || !KeyType || !Zone || !KeyUsage || !KeyName) {
        return res.status(400).send('Required fields cannot be blank');
    }

    let connection;
    try {
        connection = await connectToDB();
        const query = "UPDATE facilitykeys SET KeyType = ?, Zone = ?, KeyUsage = ?, KeyName = ?, KeyDesc = ?, KeyTag = ?, TotalNumberOfKey = ?, NumberOfSpareKey = ? WHERE KeyID = ?";
        await connection.execute(query, [KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey, keyID]);
        res.json({ updated: { keyID, KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey }, message: 'Update successful' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Could not update key", details: e.message });
    } finally {
        if (connection) await connection.end();
    }
});

keyRoutes.delete('/delete/:keyID', async (req, res) => {
    const { keyID } = req.params;

    let connection;
    try {
        connection = await connectToDB();
        const query = "DELETE FROM facilitykeys WHERE KeyID = ?";
        await connection.execute(query, [keyID]);
        res.json({ message: 'Record deleted successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Could not delete key", details: e.message });
    } finally {
        if (connection) await connection.end();
    }
});

export default keyRoutes;
