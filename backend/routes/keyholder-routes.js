import { Router } from "express";
import { connectToDB } from "../db/connection.js";

const keyholderRoutes = Router();

keyholderRoutes.get('', async (req, res) => {
    let connection;
    try {
        connection = await connectToDB();
        const response = await connection.promise().query("SELECT * FROM keyholders")
        res.json(response[0]);
    }
    catch(e){
        return new Error("could not get keyholders");
    }
    finally{
        if (connection) await connection.end();
    }
})

keyholderRoutes.post('/create', async (req, res) => {
    const { holderName } = req.body;

    if (!holderName) {
        return res.status(400).send('Fields cannot be blank');
    }

    let connection;
    try {
        connection = await connectToDB();
        const query = "INSERT INTO keyholders (HolderName) VALUES (?)";
        await connection.execute(query, [holderName]);
        res.json({ name: { holderName }, message: 'Creation successful' });
    } catch (e) {
        console.error(e); 
        res.status(500).json({ error: "Could not add Keyholder", details: e.message });
    } finally {
        if (connection) await connection.end();
    }
})

keyholderRoutes.put('/update/:holderID', async (req, res) => {
    const { holderID } = req.params;
    const { holderName } = req.body;

    if (!holderID || !holderName) {
        return res.status(400).send('Fields cannot be blank');
    }

    let connection;
    try {
        connection = await connectToDB();

        const query = "UPDATE keyholders SET HolderName = ? WHERE HolderID = ?";
        await connection.execute(query, [holderName, holderID]);

        const query2 = "UPDATE facilitykeytransactions SET HolderName = ? WHERE HolderID = ?";
        await connection.execute(query2, [holderName, holderID])
        
        res.json({ updated: { holderID, holderName }, message: 'Update successful' });
    } catch (e) {
        console.error(e); 
        res.status(500).json({ error: "Could not update keyholders", details: e.message });
    } finally {
        if (connection) await connection.end();
    }
});

keyholderRoutes.delete('/delete/:holderID', async (req, res) => {
    const { holderID } = req.params;

    let connection;
    try {
        connection = await connectToDB();
        const query = "DELETE FROM keyholders WHERE HolderID = ?";
        await connection.execute(query, [holderID])
        res.json({ message: 'Record deleted successfully' });
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).json({ error: "Could not delete keyholder", details: e.message });
    } finally {
        if (connection) await connection.end();
    }
})



export default keyholderRoutes;