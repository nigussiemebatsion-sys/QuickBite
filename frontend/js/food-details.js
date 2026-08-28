document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const food = foodById(params.get("id")) || foods[0];

  document.querySelector("#food-image").src = food.image;
  document.querySelector("#food-image").alt = food.name;
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
