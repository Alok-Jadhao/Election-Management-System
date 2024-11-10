const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Alok@123',
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
