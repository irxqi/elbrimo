const { Client } = require("discord.js-selfbot-v13");
const keep_alive = require('./keep_alive.js')
const dotenv = require("dotenv");
const client = new Client({
  checkUpdate: false,
  ws: { properties: { $browser: "Discord iOS" } },
});

client.on("ready", async () => {
  console.log(`${client.user.username} is ready!`);
  
  // Function to send message
  const sendMessage = async () => {
    const channel = client.channels.cache.get("1121041566497251342"); // Replace CHANNEL_ID with the ID of the channel you want to send messages to
    if (!channel) return console.error("Channel not found!");

    try {
      await channel.send("owo pray");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Initial message send
  sendMessage();

  // Set interval to send message every 5 minutes and 1 second (300000 ms + 1000 ms)
  setInterval(sendMessage, 301000);
});

client.login(process.env.TOKEN);


