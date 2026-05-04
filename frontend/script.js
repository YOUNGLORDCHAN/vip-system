async function joinVIP() {
  const email = prompt("Enter email");
  const password = prompt("Enter password");

  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.success) {
    alert("Login success — VIP coming next step");
  } else {
    alert("Invalid login");
  }
}
