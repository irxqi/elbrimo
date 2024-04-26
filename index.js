const { Client, GatewayIntentBits, ButtonBuilder, ActionRowBuilder, EmbedBuilder, SlashCommandBuilder, ButtonStyle, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActivityType, Collection} = require('discord.js');
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
        '2': [ 'B3B3CC-8080A3-595980-33334D', '\nNTTS' ],
        '3': [ 'ffafbd-ffc3a0', 'Roseanna' ],
        '4': [ '6f80f2-a273be-c86b9b-ea677f', '\nspecial' ],        
        '5': [ 'ddd6f3-faaca8', 'Almost' ],
        '6': [ 'D6A8FF-9E69FF-7B42D6-542FA6', '\nAmethyst Aura' ],  
        '7': [ 'FFCC99-FF9966-FF6633-CC3300', '\nAutumn Blaze' ],   
        '8': [ '6497b1-005b96-03396c-011f4b', '\nBeautiful Blues' ],
        '9': [ 'e86af0-9e379f-493267-373854', '\nDown Town' ]
}
    
// To get the gradient associated with a number:
function getGradient(number) {
        return gradients[number];
}

require('dotenv').config();


client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}`);
});


// New command to start the process with a button
client.on('messageCreate', async (message) => {
  if (message.content === 'pfp' && message.author.id === "849321326983774269") {
        message.delete()
        const button = new ButtonBuilder()
                .setCustomId('pfp_button')
                .setLabel('generate pfp')
                .setStyle(ButtonStyle.Success)
                .setEmoji('1233473873584984266');
        
        const row = new ActionRowBuilder()
                .addComponents(button);          

        await message.channel.send({
        content: 'Choose one of the palettes\nhttps://cdn.discordapp.com/attachments/869263962544410635/1233461864910946419/image_5.png?ex=662d2e61&is=662bdce1&hm=30bb60c7e2daed9c164a4faf5d42bb83d378732cb3f5de3608d86849593d1e86&',
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

  // Send the URL to the user via DM
  interaction.user.send(base_url);
});

client.login(process.env.token);
