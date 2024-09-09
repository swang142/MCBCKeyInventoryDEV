import { Router } from 'express';
import FacilityKey from '../models/keyModel.js'; // Import your Sequelize model

const keyRoutes = Router();

// Get all facility keys
keyRoutes.get('', async (req, res) => {
    try {
        const keys = await FacilityKey.findAll(); // Use Sequelize's findAll method
        res.json(keys); // Send the result as JSON
    } catch (e) {
        console.error(e); // Log any errors
        res.status(500).json({ error: "Could not get keys", details: e.message }); // Send error response
    }
});

// Create a new facility key
keyRoutes.post('/create', async (req, res) => {
    const { KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey } = req.body;

    if (!KeyType || !Zone || !KeyUsage || !KeyName) {
        return res.status(400).send('Required fields cannot be blank'); // Validate required fields
    }

    try {
        const newKey = await FacilityKey.create({ // Use Sequelize's create method
            KeyType,
            Zone,
            KeyUsage,
            KeyName,
            KeyDesc,
            KeyTag,
            TotalNumberOfKey,
            NumberOfSpareKey
        });
        res.json({ add: newKey, message: 'Creation successful' }); // Send success response
    } catch (e) {
        console.error(e); // Log any errors 
        res.status(500).json({ error: "Could not add key", details: e.message }); // Send error response
    }
});

// Update an existing facility key
keyRoutes.put('/update/:keyID', async (req, res) => {
    const { keyID } = req.params;
    const { KeyType, Zone, KeyUsage, KeyName, KeyDesc, KeyTag, TotalNumberOfKey, NumberOfSpareKey } = req.body;

    if (!KeyType || !Zone || !KeyUsage || !KeyName) {
        return res.status(400).send('Required fields cannot be blank'); // Validate required fields
    }

    try {
        const key = await FacilityKey.findByPk(keyID); // Find the key by its primary key (KeyID)
        if (!key) {
            return res.status(404).json({ message: 'Key not found' }); // Handle if key is not found
        }

        await key.update({ // Use Sequelize's update method
            KeyType,
            Zone,
            KeyUsage,
            KeyName,
            KeyDesc,
            KeyTag,
            TotalNumberOfKey,
            NumberOfSpareKey
        });

        res.json({ updated: key, message: 'Update successful' }); // Send success response
    } catch (e) {
        console.error(e); // Log any errors
        res.status(500).json({ error: "Could not update key", details: e.message }); // Send error response
    }
});

// Delete a facility key
keyRoutes.delete('/delete/:keyID', async (req, res) => {
    const { keyID } = req.params;

    try {
        const key = await FacilityKey.findByPk(keyID); // Find the key by primary key (KeyID)
        if (!key) {
            return res.status(404).json({ message: 'Key not found' }); // Handle if key is not found
        }

        await key.destroy(); // Use Sequelize's destroy method to delete the key
        res.json({ message: 'Record deleted successfully' }); // Send success response
    } catch (e) {
        console.error(e); // Log any errors
        res.status(500).json({ error: "Could not delete key", details: e.message }); // Send error response
    }
});

export default keyRoutes; // Export the router for use in other modules
