
import { useEffect, useState } from "react";

const BACKEND = "https://kaufsystem.onrender.com";

const PRODUCTS = [
  { id: "683016", name: "Lifetime", price: "€20" },
  { id: "683029", name: "6 Months", price: "€17" },
  { id: "683034", name: "1 Month", price: "€14" },
  { id: "683022", name: "1 Week", price: "€7" }
];

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const discordId = params.get("discordId");

    if (discordId) {
      setUser(discordId);
      localStorage.setItem("discordId", discordId);
    } else {
      const saved = localStorage.getItem("discordId");
      if (saved) setUser(saved);
    }
  }, []);

  const login = () => {
  const redirect = encodeURIComponent(
    "https://kaufsystem.onrender.com/auth/callback"
  );

  window.location.href =
    `https://discord.com/api/oauth2/authorize?client_id=YOUR_ID&redirect_uri=${redirect}&response_type=code&scope=identify`;
};

  const buy = (id) => {
    if (!user) return alert("Bitte zuerst einloggen");

    window.location.href =
      `${BACKEND}/buy?productId=${id}&user=${user}`;
  };

  return (
    <div style={styles.body}>
      <h1 style={styles.title}>⚡ Elite Shop</h1>

      {!user ? (
        <button style={styles.login} onClick={login}>
          Login with Discord
        </button>
      ) : (
        <p>👤 Logged in: {user}</p>
      )}

      <div style={styles.grid}>
        {PRODUCTS.map((p) => (
          <div key={p.id} style={styles.card}>
            <h2>{p.name}</h2>
            <p>{p.price}</p>
            <button style={styles.buy} onClick={() => buy(p.id)}>
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  body: {
    background: "black",
    color: "white",
    minHeight: "100vh",
    padding: 40,
    textAlign: "center",
    fontFamily: "Arial"
  },
  title: {
    fontSize: 40,
    marginBottom: 30
  },
  login: {
    padding: 12,
    background: "#5865F2",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer"
  },
  grid: {
    display: "flex",
    gap: 20,
    justifyContent: "center",
    marginTop: 40,
    flexWrap: "wrap"
  },
  card: {
    background: "#111",
    padding: 20,
    borderRadius: 15,
    width: 180,
    border: "1px solid #333"
  },
  buy: {
    marginTop: 10,
    padding: 10,
    width: "100%",
    background: "#00c853",
    border: "none",
    borderRadius: 10,
    cursor: "pointer"
  }
};
