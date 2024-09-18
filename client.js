const { Client } = require('discord.js-selfbot-v13');
const { handleClientReady, handleMessage } = require('./messageHandler');
const config = require('./config/config.json'); // Asegúrate de que config esté correctamente importado

const createClientWithProxy = (token, proxy) => {
  const client = new Client();

  // Configuración del proxy para las solicitudes de API de Discord
  client.api = require('axios').create({
    baseURL: 'https://discord.com/api/v9/',
    headers: {
      'Authorization': `Bot ${token}`
    },
    proxy: proxy ? {
      host: proxy.host,
      port: proxy.port,
      auth: proxy.auth ? {
        username: proxy.auth.username,
        password: proxy.auth.password
      } : undefined
    } : undefined
  });

  // Manejo del evento 'ready'
  client.on('ready', async () => {
    await handleClientReady(client, config);
  });

  // Manejo del evento 'messageCreate'
  client.on('messageCreate', async (message) => {
    if (message.author.bot) {
      await handleMessage(client, message, config);
    }
  });

  // Iniciar sesión con el token y el proxy configurado
  client.login(token);
};

const createClients = () => {
  config.tokens.forEach((token, index) => {
    const proxy = config.proxies[index];
    createClientWithProxy(token, proxy);
  });
};

createClients();
