const express = require("express");
const axios = require("axios");
const app = express();

app.get("/", (req, res) => {
  res.send("Backend läuft 🚀");
});

app.use(express.json());

const BACKEND_URL = "https://kaufsystemm.onrender.com";
const FRONTEND_URL = "https://cool-zabaione-c46e2c.netlify.app";

// Discord Login Callback
app.get("/auth/callback", async (req,res)=>{

  const code = req.query.code;

  const data = new URLSearchParams();
  data.append("client_id", process.env.CLIENT_ID);
  data.append("client_secret", process.env.CLIENT_SECRET);
  data.append("grant_type", "authorization_code");
  data.append("code", code);
  data.append("redirect_uri", BACKEND_URL + "/auth/callback");

  const token = await axios.post(
    "https://discord.com/api/oauth2/token",
    data,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const user = await axios.get("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token.data.access_token}` }
  });

  res.redirect(`${FRONTEND_URL}?discordId=${user.data.id}`);
});

// BUY ROUTE
app.get("/buy", async (req,res)=>{
  const { productId, user } = req.query;

  await axios.post("http://localhost:3001/ticket", {
    user,
    productId
  });

  res.send("Order created → ticket opened");
});

app.listen(3000, ()=>console.log("Backend running"));
