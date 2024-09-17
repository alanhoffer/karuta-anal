const path = require('path');
const { downloadImage } = require('./utils/downloadImage');
const { getSmallestNumber } = require('./card');
const { WebhookClient } = require('discord.js-selfbot-v13');

// Variable para almacenar la última vez que se realizó una acción
let lastActionTimestamp = 0;
const cooldown = 10 * 60 * 1000; // 10 minutos en milisegundos

const handleClientReady = async (client, config) => {
  console.log(`Logged in as ${client.user.tag}!`);

  try {
    const channel = await client.channels.fetch(config.channel);
    if (!channel) {
      console.error("El canal no fue encontrado o el bot no tiene acceso.");
      return;
    }

    const sendKdMessage = async () => {
      const randomUserName = await getRandomUser(channel);
      const message = randomUserName ? `kd ${randomUserName} anal` : "kd";
      try {
        await channel.send(message);
        console.log(`Mensaje '${message}' enviado.`);
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
      }
    };

    await sendKdMessage();
    setInterval(async () => {
      await sendKdMessage();
    }, config.time.drop.delay + Math.floor(Math.random() * config.time.drop.random));

  } catch (error) {
    console.error("Error al acceder al canal:", error);
  }
};

const handleMessage = async (client, message, config) => {
  const currentTimestamp = Date.now();

  if (message.content.includes(`<@${client.user.id}> took the`) || message.content.includes(`<@${client.user.id}> fought off`)) {
    if (message.channel.id === config.channel) {
      if (config.webhook.enabled) {
        const webhookClient = createWebhookClient(config);
        webhookClient.send(message.content);
      }
      console.log(`${client.user.tag} took the card`);
    }
  }

  if (message.content.includes(`is dropping`)) {
    // Verificar si el cooldown ha pasado
    if (currentTimestamp - lastActionTimestamp < cooldown) {
      const remainingTime = Math.ceil((cooldown - (currentTimestamp - lastActionTimestamp)) / 60000); // Tiempo restante en minutos
      console.log(`Cooldown activo. Esperando ${remainingTime} minutos antes de procesar la imagen.`);
      
      if (config.channel) {
        await message.channel.send(`<@${client.user.id}>, you must wait ${remainingTime} minutes before grabbing another card.`);
      }
      return; // Salir si el cooldown no ha pasado
    }

    lastActionTimestamp = currentTimestamp; // Actualizar el timestamp de la última acción

    console.log(`${client.user.tag} is dropping cards`);
    if (message.attachments.size > 0) {
      try {
        const attachment = message.attachments.first();
        const imagePath = path.join(__dirname, './assets/card_list.jpg');

        await downloadImage(attachment.url, imagePath);
        console.log('Imagen descargada.');

        const smallestNumber = await getSmallestNumber(imagePath);
        console.log(`Número más pequeño encontrado: ${smallestNumber}`);

        let reactionEmoji;
        switch (smallestNumber) {
          case 1:
            reactionEmoji = '1️⃣';
            break;
          case 2:
            reactionEmoji = '2️⃣';
            break;
          case 3:
            reactionEmoji = '3️⃣';
            break;
          default:
            reactionEmoji = ':anal:';
            break;
        }

        if (message.components.length > 0) {
          const row = message.components[0];
          const button = row.components[smallestNumber - 1];

          if (button) {
            try {
              await message.clickButton(button.customId);
              console.log(`Presionado el botón ${smallestNumber - 1}.`);
            } catch (error) {
              console.error('Error al presionar el botón:', error);
            }
          } else {
            console.log(`Botón con ID ${smallestNumber - 1} no encontrado en el mensaje.`);
          }
        } else {
          try {
            await message.react(reactionEmoji);
            console.log(`Reacción '${reactionEmoji}' añadida al mensaje.`);
          } catch (error) {
            console.error('Error al añadir la reacción:', error);
          }
        }

      } catch (error) {
        console.error("Error al procesar la imagen:", error);
      }
    }

    const filter = (reaction) => ["1️⃣", "2️⃣", "3️⃣", "4️⃣"].includes(reaction.emoji.name);
    const collector = message.createReactionCollector(filter);

    collector.on('collect', (reaction) => {
      if (reaction.count > config.reactions) {
        console.log(`${config.reactions} reactions were recorded`);
        message.react(reaction.emoji.name);
        collector.stop();
        console.log("Disabling collector");
      }
    });

    setTimeout(() => {
      collector.stop();
      console.log("Disabling collector because no one reacted");
    }, config.collector);
  }
};

const getRandomUser = async (channel) => {
  try {
    const members = await channel.members;
    const memberArray = Array.from(members.values());
    if (memberArray.length === 0) {
      console.error("No hay miembros en el canal.");
      return "";
    }
    const randomMember = memberArray[Math.floor(Math.random() * memberArray.length)];
    return randomMember.user.username;
  } catch (error) {
    console.error("Error al obtener los miembros del canal:", error);
    return "";
  }
};

module.exports = { handleClientReady, handleMessage };
