import { useEffect, useState } from "react";

const PRODUCTS = [
  { id: "683016", name: "Lifetime", price: "€20" },
  { id: "683029", name: "6 Month", price: "€17" },
  { id: "683034", name: "1 Month", price: "€14" },
  { id: "683022", name: "1 Week", price: "€7" }
];

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const discordId = url.searchParams.get("discordId");
    if (discordId) setUser(discordId);
  }, []);

  const login = () => {
    window.location.href =
      "https://discord.com/api/oauth2/authorize?client_id=YOUR_ID&redirect_uri=YOUR_BACKEND/auth/callback&response_type=code&scope=identify";
  };

  const buy = (id) => {
    if (!user) return alert("Login required");

    window.location.href =
      `https://my-bot-1-zjnv.onrender.com/buy?productId=${id}&user=${user}`;
  };

  return (
    <div style={{ padding: 40, background: "#0d0d0d", color: "white" }}>
      <h1>Shop</h1>

      {!user ? (
        <button onClick={login}>Login with Discord</button>
      ) : (
        <p>Logged in: {user}</p>
      )}

      {PRODUCTS.map((p) => (
        <div key={p.id} style={{ border: "1px solid gray", margin: 10 }}>
          <h3>{p.name}</h3>
          <p>{p.price}</p>
          <button onClick={() => buy(p.id)}>Buy</button>
        </div>
      ))}
    </div>
  );
}
