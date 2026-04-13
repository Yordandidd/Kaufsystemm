const express = require("express");
const cors = require("cors");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.login(process.env.BOT_TOKEN);

// HOME
app.get("/", (req, res) => {
  res.send("Backend running");
});

// DISCORD OAUTH CALLBACK
app.get("/auth/callback", (req, res) => {
  const code = req.query.code;

  // (optional: OAuth später erweitern)
  res.redirect(`https://cool-zabaione-c46e2c.netlify.app?discordId=USER`);
});

// CHECKOUT → TICKET SYSTEM
app.post("/checkout", async (req, res) => {
  const { user, cart } = req.body;

  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  const channel = await guild.channels.create({
    name: `ticket-${user}`,
    type: 0
  });

  let items = cart.map(p => `- ${p.name} (€${p.price})`).join("\n");

  channel.send(
    `🎟️ NEW ORDER\n\n👤 User: <@${user}>\n\n🛒 Items:\n${items}`
  );

  res.send("Ticket created");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Backend running");
});
