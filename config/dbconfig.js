// This file stores all the configuration settings for the database, server, and other related settings.

// 1. We use this file to export the database configuration to the index.js file.
// IMPORTANT:
// To export the configuration, we use `module.exports = {}`.
// - `module` represents the current module.
// - `exports` is a property of the `module` object used to export the configuration.
// - The `db` object stores all the configuration settings.

module.exports = {
    // Uncomment and configure the following if not using environment variables:
    // HOST: "localhost",        // The database host
    // USER: "root",             // The database user
    // PASSWORD: "",             // The database password (empty if not used)
    // DB: "sudip",              // The name of the databases
    // Using environment variables for configuration:
    HOST: process.env.DB_HOST,       // The database host
    USER: process.env.DB_USER,       // The database user
    PASSWORD: process.env.DB_PASSWORD, // The database password (empty if not used)
    DB: process.env.DB_NAME,         // The name of the database
    dialect: "mysql",               // The dialect (in this case, MySQL)
    PORT: process.env.DB_PORT,
    // The port to connect to the database (default for MySQL is 3306)
    //for online database port number is:41980

    // Optionally, you can include the connection pool settings as shown below:
    // pool: {
    //     max: 5,               // Maximum number of connections in the pool
    //     min: 0,               // Minimum number of connections in the pool
    //     acquire: 30000,       // Maximum time (in ms) that a connection can be idle before being released
    //     idle: 10000           // Maximum time (in ms) to wait for a connection to be established
    // }

};
