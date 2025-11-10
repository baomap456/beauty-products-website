module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Roles', [
            { ID_Role: 1, Name_Role: 'admin' },
            { ID_Role: 2, Name_Role: 'user' }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Roles', { ID_Role: [1, 2] }, {});
    }
};