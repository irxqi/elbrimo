const { REST, Routes, Client, GatewayIntentBits, ButtonBuilder, ActionRowBuilder, EmbedBuilder, SlashCommandBuilder, ButtonStyle, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActivityType, Collection} = require('discord.js');
const fs = require('fs');
const keep_alive = require('./keep_alive.js')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const gradients = {
        '1': [ 'B7E2A8-8FD780-5AAE52-327B36', '\nEmerald Shimmer' ],
        '2': [ 'b8accc-9c98c4-3b4b98-1c2978-1c2775', '\nNTTS' ],
        '3': [ 'aec8ce-9fb9bf-d6c7c7-ddadad-b88c8c', 'Roseanna' ],
        '4': [ '6f80f2-a273be-c86b9b-ea677f', '\nspecial' ],        
        '5': [ 'dec2cb-c5b9cd-abb1cf-92a8d1', 'Almost' ],
        '6': [ 'D6A8FF-9E69FF-7B42D6-542FA6', '\nAmethyst Aura' ],  
        '7': [ 'FFCC99-FF9966-FF6633-CC3300', '\nAutumn Blaze' ],   
        '8': [ '6497b1-005b96-03396c-011f4b', '\nBeautiful Blues' ],
        '9': [ '0057e7-d62d20-ffa700', '\nGoogle' ]
}
    
// To get the gradient associated with a numbear:
function getGradient(number) {
        return gradients[number];
}

require('dotenv').config();


client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}`);
});


// New command to start the process with a button
client.on('messageCreate', async (message) => {
  if (message.content === 'pfp' && message.author.id === process.env.authid) {
        message.delete()
        const button = new ButtonBuilder()
                .setCustomId('pfp_button')
                .setLabel('generate pfp')
                .setStyle(ButtonStyle.Success)
                .setEmoji('1233473873584984266');
        
        const row = new ActionRowBuilder()
                .addComponents(button);          

        await message.channel.send({
        content: 'Choose one of the [palettes](https://cdn.discordapp.com/attachments/869263962544410635/1233660383567548468/pfps.png?ex=662de743&is=662c95c3&hm=26067d11fc3def307908d4eaa0dfad25e549a2546be13c577e648426c1ba2a13&)',
        components: [row],
        });
  }
});

// Handle button interaction
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'pfp_button') {
      const model = new ModalBuilder()
      .setTitle('Enter your name')
      .setCustomId('name_input')

        // Create the text input components
        const usernameInput = new TextInputBuilder()
         .setCustomId('users')
         // The label is the prompt the user sees for this input
         .setLabel("What's your username?")
         // Short means only a single line of text
         .setStyle(TextInputStyle.Short);

        const numberInput = new TextInputBuilder()
         .setCustomId('numbers')
         .setLabel("Choose palette (1-9)")
         // Paragraph means multiple lines of text.
         .setStyle(TextInputStyle.Short);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const username = new ActionRowBuilder().addComponents(usernameInput);
        const number = new ActionRowBuilder().addComponents(numberInput);

        // Add inputs to the modal
        model.addComponents(username, number);
        await interaction.showModal(model);
  }
});

// Handle the submission of the form
client.on(Events.InteractionCreate, interaction => {
  if (!interaction.isModalSubmit()) return;

  const name = interaction.fields.getTextInputValue('users');
  const number = interaction.fields.getTextInputValue('numbers');

  // Generate the URL based on name and number
  const gradient = getGradient(parseInt(number));
  const base_url = `https://minecraftpfp.com/api/pfp/${name}.png?gradient=${gradient}`;  

  // Acknowledge the interaction with an ephemeral message
  interaction.reply({ content: 'Your request is being processed', ephemeral: true });

  // Send the URL to the user via DM
  interaction.user.send(base_url);
});

client.login(process.env.token);
