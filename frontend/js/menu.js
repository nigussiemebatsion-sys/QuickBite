document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector("#food-grid");

  if (!grid) return;

  await loadFoods();

  if (foods.length === 0) {
    grid.innerHTML = `
      <p class="error-message">
        Unable to load foods. Please try again.
      </p>
    `;
    return;
  }

  grid.innerHTML = foods.map(food => `
    <article class="food-card">

      <img
        src="${food.image || "img/placeholder.jpg"}"
        alt="${food.name}"
        loading="lazy"
        onerror="this.style.background='#e8e0d0';this.removeAttribute('src')"
      >

      <div class="food-card-body">

        <div class="food-meta">
          <h3>${food.name}</h3>
          <span class="price">${money(food.price)}</span>
        </div>

        <p>${food.description}</p>

        <div class="card-actions">

          <a
            class="btn btn-outline"
            href="food-details.html?id=${food.id}"
          >
            View Details
          </a>

          <button
            class="btn btn-primary"
            data-add="${food.id}"
            ${food.available ? "" : "disabled"}
          >
            ${food.available ? "Add to Cart" : "Unavailable"}
          </button>

        </div>

      </div>

    </article>
  `).join("");

  grid.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.add);
    });
  });
});