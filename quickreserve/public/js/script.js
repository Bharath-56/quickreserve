// ✅ Utility to toggle navigation links based on login status
function updateNavbar() {
  const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";

  const myBookings = document.getElementById("nav-mybookings");
  const search = document.getElementById("nav-search");
  const admin = document.getElementById("nav-admin");

  if (myBookings) myBookings.style.display = isLoggedIn ? "inline-block" : "none";
  if (search) search.style.display = isLoggedIn ? "inline-block" : "none";
  if (admin) admin.style.display = isLoggedIn ? "inline-block" : "none";
}

// ✅ Handle login form submission
async function handleLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        sessionStorage.setItem("loggedIn", "true");
        window.location.href = "/index.html";
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Try again.");
    }
  });
}

function handleRegisterForm() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("✅ Registered successfully. Please log in.");
        window.location.href = "/login.html";
      } else {
        alert("❌ Registration failed.");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("Something went wrong.");
    }
  });
}


// ✅ Fetch train list on admin.html
async function loadTrainList() {
  const trainList = document.getElementById("train-list");
  if (!trainList) return;

  try {
    const res = await fetch("/admin/trains");
    const trains = await res.json();

    trainList.innerHTML = "";

    trains.forEach((train) => {
      const item = document.createElement("li");
      item.innerHTML = `
        <strong>${train.name}</strong> - ${train.source} to ${train.destination} on ${train.date}<br>
        Depart: ${train.departure_time} | Arrive: ${train.arrival_time}
      `;
      trainList.appendChild(item);
    });
  } catch (err) {
    console.error("❌ Failed to load trains:", err);
  }
}

// ✅ On page load
document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
  handleLoginForm();
  handleRegisterForm();
  loadTrainList();
});