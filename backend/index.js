const express = require("express");
const axios = require("axios");

const app = express();

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend läuft 🚀");
});

// DISCORD OAUTH CALLBACK (GEFIXT)
app.get("/auth/callback", async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) return res.send("No code provided");

    // TOKEN REQUEST
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.REDIRECT_URI
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // USER INFO
    const userResponse = await axios.get(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const user = userResponse.data;

    console.log("User logged in:", user.id, user.username);

    // redirect to frontend
    return res.redirect(
      `${process.env.FRONTEND_URL}?discordId=${user.id}`
    );

  } catch (err) {
    console.error(err);
    return res.send("OAuth Error");
  }
});

// BUY ROUTE (OPTIONAL)
app.get("/buy", (req, res) => {
  const { productId, user } = req.query;
  console.log("ORDER:", productId, user);

  res.send("Order received");
});

// PORT FIX (WICHTIG FÜR RENDER)
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
