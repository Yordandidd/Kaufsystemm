import { useEffect, useState } from "react";

const BACKEND = "https://kaufsystemm-1.onrender.com";

const PRODUCTS = [
  { id: "683016", name: "Lifetime", price: 20 },
  { id: "683029", name: "6 Months", price: 17 },
  { id: "683034", name: "1 Month", price: 14 },
  { id: "683022", name: "1 Week", price: 7 }
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem("discordId");
    if (id) setUser(id);
  }, []);

  // LOGIN
  const login = () => {
    window.location.href =
      "https://discord.com/api/oauth2/authorize" +
      "?client_id=YOUR_CLIENT_ID" +
      "&redirect_uri=" +
      encodeURIComponent(BACKEND + "/auth/callback") +
      "&response_type=code&scope=identify";
  };

  // CART
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((p) => p.id !== id));
  };

  const clearCart = () => setCart([]);

  // CHECKOUT
  const checkout = () => {
    if (!user) return alert("Login first");

    fetch(`${BACKEND}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, cart })
    }).then(() => {
      alert("Ticket created!");
      clearCart();
    });
  };

  return (
    <div style={{ padding: 40, color: "white", background: "#0f0f0f" }}>
      <h1>🔥 Shop</h1>

      {!user ? (
        <button onClick={login}>Login Discord</button>
      ) : (
        <p>👤 {user}</p>
      )}

      <h2>Products</h2>

      {PRODUCTS.map((p) => (
        <div key={p.id} style={{ margin: 10, padding: 10, border: "1px solid gray" }}>
          {p.name} - €{p.price}
          <button onClick={() => addToCart(p)}>Add</button>
        </div>
      ))}

      <h2>Cart</h2>

      {cart.map((c) => (
        <div key={c.id}>
          {c.name}
          <button onClick={() => removeFromCart(c.id)}>Remove</button>
        </div>
      ))}

      {cart.length > 0 && (
        <button onClick={checkout} style={{ marginTop: 20 }}>
          Checkout (Create Ticket)
        </button>
      )}
    </div>
  );
}
