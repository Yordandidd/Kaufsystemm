const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const app = express();
app.use(express.json());

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log("Bot online");
});

app.post("/ticket", async (req, res) => {
  const { user, productId } = req.body;

  const guild = client.guilds.cache.get("YOUR_GUILD_ID");

  const channel = await guild.channels.create({
    name: `ticket-${user}`,
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        deny: ["ViewChannel"]
      },
      {
        id: user,
        allow: ["ViewChannel", "SendMessages"]
      }
    ]
  });

  channel.send(`
🎟️ NEW ORDER

👤 <@${user}>
📦 Product: ${productId}
💳 Status: Pending
  `);

  res.send("ok");
});

client.login(process.env.TOKEN);

app.listen(3001);
