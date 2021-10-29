const Sequelize = require('sequelize');

const sequelize = new Sequelize('library.db', 'user', 'pass', {
    dialect: 'sqlite',
    logging: false,
    host: './library.db'
});

module.exports = sequelize;