function renderCart() {
  const container = document.querySelector("#cart-items");
  const summary = document.querySelector("#cart-summary");
  if (!container || !summary) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty">
        <h2>Your cart is empty</h2>
        <p class="muted">Add something delicious from the menu.</p>
        <a class="btn btn-primary" href="menu.html">Browse Menu</a>
      </div>`;
    summary.innerHTML = "";
    return;
  }

  container.innerHTML = cart.map(item => {
    const food = foodById(item.id);
    const itemTotal = food.price * item.quantity;
    return `
      <div class="cart-item">
        <img src="${food.image || "img/placeholder.jpg"}" alt="${food.name}">
        <div>
          <h3>${food.name}</h3>
          <span class="muted">${money(food.price)} each</span>
          <div class="cart-controls">
            <button data-action="decrease" data-id="${food.id}">−</button>
            <strong>${item.quantity}</strong>
            <button data-action="increase" data-id="${food.id}">+</button>
            <button class="remove-btn" data-action="remove" data-id="${food.id}">Remove</button>
          </div>
        </div>
        <strong class="price">${money(itemTotal)}</strong>
      </div>`;
  }).join("");

  const subtotal = cart.reduce((sum, item) => {
    const food = foodById(item.id);
    return sum + food.price * item.quantity;
  }, 0);

  summary.innerHTML = `
    <div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
    <div class="summary-row summary-total"><span>Total</span><strong>${money(subtotal)}</strong></div>
    <a class="btn btn-outline" href="menu.html">Continue Shopping</a>
    <a class="btn btn-primary" href="checkout.html">Proceed to Checkout</a>`;

  container.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      const action = button.dataset.action;
      const currentCart = getCart();
      const item = currentCart.find(x => x.id === id);

      if (action === "increase") item.quantity++;
      if (action === "decrease") item.quantity--;
      if (action === "remove" || item.quantity <= 0) {
        const index = currentCart.findIndex(x => x.id === id);
        currentCart.splice(index, 1);
      }

      saveCart(currentCart);
      renderCart();
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadFoods();
  renderCart();
});
