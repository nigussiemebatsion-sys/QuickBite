document.addEventListener("DOMContentLoaded", async () => {
  await loadFoods();

  const params = new URLSearchParams(window.location.search);
  const food = foodById(params.get("id")) || foods[0];

  if (!food) {
    document.querySelector("#food-name").textContent = "Food not available";
    return;
  }

  const foodImg = document.querySelector("#food-image");
  foodImg.src = food.image || "";
  foodImg.onerror = () => { foodImg.style.background = "#e8e0d0"; foodImg.removeAttribute("src"); };
  foodImg.alt = food.name;
  document.querySelector("#food-name").textContent = food.name;
  document.querySelector("#food-description").textContent = food.description;
  document.querySelector("#food-price").textContent = money(food.price);

  let quantity = 1;
  const quantityEl = document.querySelector("#quantity");
  const updateQuantity = value => {
    quantity = Math.max(1, value);
    quantityEl.textContent = quantity;
  };

  document.querySelector("#minus").addEventListener("click", () => updateQuantity(quantity - 1));
  document.querySelector("#plus").addEventListener("click", () => updateQuantity(quantity + 1));
  document.querySelector("#add-detail").addEventListener("click", () => addToCart(food.id, quantity));
});
