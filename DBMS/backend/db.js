const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'OmkarJadhav',
    password: 'omkarj@071005',
    database: 'ElectionManagementSystem'
});

module.exports = {
    connect: (callback) => {
        connection.connect(callback);
    },
    query: (query, params, callback) => {
        connection.query(query, params, callback);
    }
};