const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db/database');

class Book extends Model{}

Book.init({
    "isbn": {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true           
    },
    "title": {
        type: DataTypes.STRING,
        allowNull: false       
    },  
    "subtitle": {
        type: DataTypes.STRING,
        allowNull: true      
    },
    "author": {
        type: DataTypes.STRING,
        allowNull: false       
    },
    "published": {
        type: DataTypes.DATEONLY,
        isDate: true, 
        allowNull: false       
    },
    "publisher": {
        type: DataTypes.STRING,
        allowNull: false       
    },
    "pages": {
        type: DataTypes.STRING,
        isNumeric: true,
        isInt: true,          
        allowNull: false       
    },
    "description": {
        type: DataTypes.TEXT,
        allowNull: false       
    },
    "website": {
        type: DataTypes.STRING,
        isUrl: true,
        allowNull: false       
    } 
}, {
    sequelize,
    modelName: 'Book'
})

module.exports = Book;