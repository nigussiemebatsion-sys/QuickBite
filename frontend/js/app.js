const foods = [
  {
    id: 1, name: "Doro Wat", price: 250,
    description: "Spicy chicken stew cooked with berbere, onions, garlic, and Ethiopian spices, served with injera.",
    image: "img/dorowot.jpg"
  },
  {
    id: 2, name: "Shiro Wat", price: 180,
    description: "Smooth chickpea stew seasoned with berbere, garlic, and traditional Ethiopian spices, served with injera.",
    image: "img/shiro.jpg"
  },
  {
    id: 3, name: "Tibs", price: 280,
    description: "Sautéed beef cooked with onions, peppers, rosemary, and Ethiopian spices.",
    image: "img/tibs.jpg"
  },
  {
    id: 4, name: "Kitfo", price: 300,
    description: "Minced beef seasoned with mitmita and Ethiopian spiced butter, traditionally served with ayib and greens.",
    image: "img/kitfo.jpg"
  },
  {
    id: 5, name: "Firfir", price: 160,
    description: "Pieces of injera mixed with spicy berbere sauce and seasoned butter.",
    image: "img/firfir.jpg"
  },
  {
    id: 6, name: "Misir Wat", price: 150,
    description: "Spicy red lentil stew cooked with berbere, onions, garlic, and traditional Ethiopian spices.",
    image: "img/misirwot.jpg"
  },
  {
    id: 7, name: "Gomen", price: 140,
    description: "Slow-cooked collard greens seasoned with garlic, ginger, and Ethiopian spices.",
    image: "img/gomen.jpg"
  },
  {
    id: 8, name: "Beyaynetu", price: 220,
    description: "A colorful combination of Ethiopian vegetarian dishes served together with injera.",
    image: "img/beyaynetu.jpg"
  },
  {
    id: 9, name: "Dulet", price: 270,
    description: "Traditional Ethiopian dish made with finely chopped meat, liver, and spices.",
    image: "img/dulet.jpg"
  },
  {
    id: 10, name: "Chechebsa", price: 150,
    description: "Torn pieces of flatbread mixed with spiced butter and berbere, commonly served for breakfast.",
    image: "img/chechebsa.jpg"
  }
];

function getCart() {
  return JSON.parse(localStorage.getItem("quickbiteCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("quickbiteCart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id, quantity = 1) {
  const food = foods.find(item => item.id === Number(id));
  if (!food) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === food.id);

  if (existing) existing.quantity += quantity;
  else cart.push({ id: food.id, quantity });

  saveCart(cart);
}

function updateCartCount() {
  const count = getCart().reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach(el => el.textContent = count);
}

function money(value) {
  return `${Number(value).toFixed(2)} ETB`;
}

function foodById(id) {
  return foods.find(food => food.id === Number(id));
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }

  document.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => addToCart(button.dataset.add));
  });
});
