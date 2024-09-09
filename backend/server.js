import app from "./app.js";
import sequelize from "./db/connection.js";

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        // Sync models with the database
        await sequelize.sync(); // You can use { force: true } or { alter: true } based on your needs
        console.log('Database synced successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.error('Error syncing the database:', error);
    }
})();
