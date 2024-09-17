const Discord = require('discord.js-selfbot-v13');
const { handleClientReady, handleMessage } = require('./messageHandler');

const createClients = (config) => {
  config.tokens.forEach(token => {
    const client = new Discord.Client();

    client.on('ready', async () => {
      await handleClientReady(client, config);
    });

    client.on('messageCreate', async (message) => {
      if (message.author.bot) {
        await handleMessage(client, message, config);
      }
    });

    client.login(token);
  });
};

module.exports = { createClients };

