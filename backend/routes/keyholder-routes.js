import { Router } from 'express';
import Keyholder from '../models/keyholderModel.js'; // Import the Keyholder Sequelize model
import FacilityKeyTransaction from '../models/keyTransactionModel.js'; // Import the Transaction model for updating

const keyholderRoutes = Router();

// Get all keyholders
keyholderRoutes.get('', async (req, res) => {
    try {
        const keyholders = await Keyholder.findAll(); // Use Sequelize's findAll method
        res.json(keyholders); // Send the result as JSON
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).json({ error: "Could not get keyholders", details: e.message }); // Send error response
    }
});

// Create a new keyholder
keyholderRoutes.post('/create', async (req, res) => {
    const { holderName } = req.body;

    if (!holderName) {
        return res.status(400).send('Fields cannot be blank'); // Validate required fields
    }

    try {
        const newKeyholder = await Keyholder.create({ // Use Sequelize's create method
            HolderName: holderName
        });
        res.json({ name: newKeyholder, message: 'Creation successful' }); // Send success response
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).json({ error: "Could not add Keyholder", details: e.message }); // Send error response
    }
});

// Update an existing keyholder
keyholderRoutes.put('/update/:holderID', async (req, res) => {
    const { holderID } = req.params;
    const { holderName } = req.body;

    if (!holderID || !holderName) {
        return res.status(400).send('Fields cannot be blank'); // Validate required fields
    }

    try {
        const keyholder = await Keyholder.findByPk(holderID); // Find the keyholder by primary key (HolderID)
        if (!keyholder) {
            return res.status(404).json({ message: 'Keyholder not found' }); // Handle if keyholder not found
        }

        await keyholder.update({ HolderName: holderName }); // Update the keyholder record

        // Also update any related transactions where this keyholder was involved
        await FacilityKeyTransaction.update({ HolderName: holderName }, { where: { HolderID: holderID } });

        res.json({ updated: keyholder, message: 'Update successful' }); // Send success response
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).json({ error: "Could not update keyholders", details: e.message }); // Send error response
    }
});

// Delete a keyholder
keyholderRoutes.delete('/delete/:holderID', async (req, res) => {
    const { holderID } = req.params;

    try {
        const keyholder = await Keyholder.findByPk(holderID); // Find the keyholder by primary key (HolderID)
        if (!keyholder) {
            return res.status(404).json({ message: 'Keyholder not found' }); // Handle if keyholder not found
        }

        await keyholder.destroy(); // Use Sequelize's destroy method to delete the keyholder
        res.json({ message: 'Record deleted successfully' }); // Send success response
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).json({ error: "Could not delete keyholder", details: e.message }); // Send error response
    }
});

export default keyholderRoutes; // Export the router for use in other modules
