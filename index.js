const { createClients } = require('./client');
const config = require('./config/config.json');

// Crear y configurar los clientes
createClients(config);
