document.addEventListener("DOMContentLoaded", async () => {
  await loadFoods();

  const cart       = getCart();
  const orderItems = document.querySelector("#order-items");
  const totalEl    = document.querySelector("#checkout-total");
  const form       = document.querySelector("#checkout-form");

  if (!orderItems || !totalEl || !form) return;

  // Show empty cart message and disable the submit button.
  if (cart.length === 0) {
    orderItems.innerHTML = `<p class="muted">Your cart is empty. <a href="menu.html">Go to the menu.</a></p>`;
    form.querySelector("button[type='submit']").disabled = true;
    return;
  }

  // Display the order summary and total (calculated from local food data for display only).
  // The backend will recalculate the authoritative total from its own prices.
  const displayTotal = cart.reduce((sum, item) => {
    const food = foodById(item.id);
    if (!food) return sum;
    return sum + Number(food.price) * item.quantity;
  }, 0);

  orderItems.innerHTML = cart.map(item => {
    const food = foodById(item.id);
    if (!food) return "";
    return `<div class="summary-row">
      <span>${food.name} × ${item.quantity}</span>
      <strong>${money(food.price * item.quantity)}</strong>
    </div>`;
  }).join("");

  totalEl.textContent = money(displayTotal);

  // Block non-digit keypresses on the phone field in real time.
  const phoneInput = document.querySelector("#phone");
  phoneInput.addEventListener("keydown", e => {
    // Allow: backspace, delete, tab, escape, enter, arrow keys, home, end
    const allowed = ["Backspace","Delete","Tab","Escape","Enter","ArrowLeft","ArrowRight","Home","End"];
    if (allowed.includes(e.key)) return;
    // Allow Ctrl/Cmd shortcuts (copy, paste, select all)
    if ((e.ctrlKey || e.metaKey) && ["a","c","v","x"].includes(e.key.toLowerCase())) return;
    // Block anything that is not a digit
    if (!/^\d$/.test(e.key)) e.preventDefault();
  });
  // Also strip non-digits on paste
  phoneInput.addEventListener("paste", e => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData("text");
    const digitsOnly = pasted.replace(/\D/g, "");
    document.execCommand("insertText", false, digitsOnly);
  });

  // Handle form submission.
  form.addEventListener("submit", async event => {
    event.preventDefault();

    // Read and trim delivery details from the existing input fields.
    const customer_name    = document.querySelector("#customer-name").value.trim();
    // Strip any non-digit characters from the phone field.
    const phone            = document.querySelector("#phone").value.replace(/\D/g, "");
    const delivery_address = document.querySelector("#address").value.trim();

    // Frontend validation — backend validates again independently.
    if (!customer_name || !delivery_address) {
      alert("Please complete all delivery details.");
      return;
    }

    if (!phone) {
      alert("Phone number is required and must contain digits only.");
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Placing order…";

    try {
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name,
          phone,
          delivery_address,
          items: cart.map(item => ({
            foodId:   item.id,
            quantity: item.quantity
          }))
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Order could not be placed.");
      }

      // Save order info for the confirmation page, using the backend's values.
      localStorage.setItem("quickbiteLastOrder", JSON.stringify({
        id:               result.data.id,
        customer_name:    result.data.customer_name,
        phone:            result.data.phone,
        delivery_address: result.data.delivery_address,
        total:            result.data.total,
        status:           result.data.status
      }));

      localStorage.removeItem("quickbiteCart");
      window.location.href = "order-confirmation.html";

    } catch (error) {
      console.error("Order submission failed:", error);
      alert(error.message || "Could not place your order. Please try again.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Place Order";
    }
  });
});
