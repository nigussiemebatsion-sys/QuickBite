document.addEventListener("DOMContentLoaded", () => {
  const cart = getCart();
  const orderItems = document.querySelector("#order-items");
  const totalEl = document.querySelector("#checkout-total");
  const form = document.querySelector("#checkout-form");

  if (cart.length === 0) {
    orderItems.innerHTML = `<p class="muted">Your cart is empty. <a href="menu.html">Go to the menu.</a></p>`;
    form.querySelector("button").disabled = true;
    return;
  }

  const total = cart.reduce((sum, item) => {
    const food = foodById(item.id);
    return sum + food.price * item.quantity;
  }, 0);

  orderItems.innerHTML = cart.map(item => {
    const food = foodById(item.id);
    return `<div class="summary-row">
      <span>${food.name} × ${item.quantity}</span>
      <strong>${money(food.price * item.quantity)}</strong>
    </div>`;
  }).join("");

  totalEl.textContent = money(total);

  form.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.querySelector("#customer-name").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const address = document.querySelector("#address").value.trim();

    if (!name || !phone || !address) {
      alert("Please complete all delivery details.");
      return;
    }

    localStorage.setItem("quickbiteLastOrder", JSON.stringify({
      name, phone, address, total, items: cart
    }));
    localStorage.removeItem("quickbiteCart");
    window.location.href = "order-confirmation.html";
  });
});
