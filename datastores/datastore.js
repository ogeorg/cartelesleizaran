const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || '3306',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_NAME || 'cartelesleizaran'
});

function Datastore() {
    this.kind = 'MariaDB';
    this.getConnection = async function() {
        try {
            const connection = await pool.getConnection();
            return connection;
        } catch (error) {
            console.log(error);
        }
    }

    // Add this line:
    this.end = async function() {
        await pool.end();
    };
};


module.exports = Datastore;
