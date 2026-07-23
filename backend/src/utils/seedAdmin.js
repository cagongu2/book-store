const User = require('../users/user.model');

const seedDefaultAdmin = async () => {
    try {
        const isProduction = process.env.NODE_ENV === 'production';
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (isProduction && (!adminUsername || !adminPassword)) {
            return;
        }

        const usernameToSeed = adminUsername || 'admin';
        const passwordToSeed = adminPassword || 'admin123';

        const existingAdmin = await User.findOne({
            $or: [
                { username: usernameToSeed },
                { role: 'admin' }
            ]
        });

        if (existingAdmin) {
            return;
        }

        const newAdmin = new User({
            username: usernameToSeed,
            password: passwordToSeed,
            role: 'admin',
            isActive: true
        });

        await newAdmin.save();
        console.log('[System] Admin account initialized.');
    } catch (error) {
        console.error('[System] Admin initialization error.');
    }
};

module.exports = seedDefaultAdmin;
