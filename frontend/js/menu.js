document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#food-grid");
  if (!grid) return;

  grid.innerHTML = foods.map(food => `
    <article class="food-card">
      <img src="${food.image}" alt="${food.name}" loading="lazy">
      <div class="food-card-body">
        <div class="food-meta">
          <h3>${food.name}</h3>
          <span class="price">${money(food.price)}</span>
        </div>
        <p>${food.description}</p>
        <div class="card-actions">
          <a class="btn btn-outline" href="food-details.html?id=${food.id}">View Details</a>
          <button class="btn btn-primary" data-add="${food.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => addToCart(button.dataset.add));
  });
});
