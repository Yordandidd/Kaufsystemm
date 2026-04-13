const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;

  const data = new URLSearchParams();
  data.append("client_id", process.env.CLIENT_ID);
  data.append("client_secret", process.env.CLIENT_SECRET);
  data.append("grant_type", "authorization_code");
  data.append("code", code);
  data.append("redirect_uri", process.env.REDIRECT_URI);

  const token = await axios.post(
    "https://discord.com/api/oauth2/token",
    data,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const user = await axios.get("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token.data.access_token}`
    }
  });

  res.redirect(`https://YOUR_FRONTEND?discordId=${user.data.id}`);
});

app.get("/buy", (req, res) => {
  const { productId, user } = req.query;

  axios.post("http://localhost:3001/ticket", {
    user,
    productId
  });

  res.send("Order created");
});

app.listen(3000, () => console.log("Backend running"));
