let foods = [];
let foodsRequest = null;

async function loadFoods() {
  if (foodsRequest) {
    return foodsRequest;
  }

  foodsRequest = (async () => {
    try {
      const response = await fetch("http://localhost:3000/api/foods");

      if (!response.ok) {
        throw new Error("Failed to load foods");
      }

      const result = await response.json();
      foods = Array.isArray(result?.data) ? result.data : [];
      return foods;
    } catch (error) {
      console.error("Error loading foods:", error);
      foods = [];
      return [];
    }
  })();

  return foodsRequest;
}

function getCart() {
  return JSON.parse(localStorage.getItem("quickbiteCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("quickbiteCart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id, quantity = 1) {
  const food = foods.find(item => item.id === Number(id));

  if (!food) {
    console.error("Food not found:", id);
    return;
  }

  const cart = getCart();

  const existing = cart.find(item => item.id === food.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: food.id,
      quantity: quantity
    });
  }

  saveCart(cart);
}

function updateCartCount() {
  const count = getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );

  document.querySelectorAll(".cart-count").forEach(
    element => {
      element.textContent = count;
    }
  );
}

function money(value) {
  return `${Number(value).toFixed(2)} ETB`;
}

function foodById(id) {
  return foods.find(
    food => food.id === Number(id)
  );
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadFoods();

  updateCartCount();

  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });
  }
});