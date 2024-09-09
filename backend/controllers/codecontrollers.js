import speakeasy from 'speakeasy';
import AccessCode from '../models/accessCodeModel.js'; // Import the AccessCode model

// Generate code
const generateCode = async (req, res) => {
    const { username } = req.body;

    const secret = speakeasy.generateSecret({ length: 20 });

    const authToken = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
        step: 300 // 5 minutes expiration
    });

    try {
        // Insert the generated code and secret into the access_codes table using Sequelize
        await AccessCode.create({
            code: authToken,
            secret: secret.base32,
            created_by: username
        });

        res.status(200).json({ authToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generating code', details: error.message });
    }
};

// Validate code
const validateCode = async (req, res) => {
    const { code } = req.body;

    try {
        // Fetch the access code record from the database using Sequelize
        const record = await AccessCode.findOne({
            where: {
                code: code,
                is_used: false
            }
        });

        if (!record) {
            return res.status(403).json({ status: false, error: 'Invalid or expired code' });
        }

        // Verify the code using speakeasy
        const isValid = speakeasy.totp.verify({
            secret: record.secret,
            encoding: 'base32',
            token: code,
            step: 300 // Token is valid for 5 minutes
        });

        if (!isValid) {
            return res.status(403).json({ status: false, error: 'Invalid or expired code' });
        }

        // Mark the code as used in the database
        await record.update({ is_used: true });

        res.status(200).json({ status: true, message: 'Code is valid, proceed to registration' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error validating code', details: error.message });
    }
};

export { generateCode, validateCode };
