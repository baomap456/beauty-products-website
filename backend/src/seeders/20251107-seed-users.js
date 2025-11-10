const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const adminPass = bcrypt.hashSync('admin123', 8);
        const userPass = bcrypt.hashSync('user123', 8);

        return queryInterface.bulkInsert('Users', [
            {
                ID_User: 1,
                FullName: 'Administrator',
                Email: 'admin@example.com',
                Password: adminPass,
                Role_ID: 1,
            },
            {
                ID_User: 2,
                FullName: 'Regular User',
                Email: 'user@example.com',
                Password: userPass,
                Role_ID: 2,
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', {
            Email: ['admin@example.com', 'user@example.com']
        }, {});
    }
};