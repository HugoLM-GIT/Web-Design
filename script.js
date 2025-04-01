document.addEventListener("DOMContentLoaded", () => {
  const cart = {}; // Stores items as { name: { quantity, price } }
  const cartPopup = document.getElementById("cart-popup");
  const cartItemsList = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  // Show Cart Pop-up
  document.getElementById("cart-icon").addEventListener("click", () => {
    cartPopup.style.display = "block";
    updateCartDisplay();
  });

  // Close Cart Pop-up
  document.getElementById("close-cart").addEventListener("click", () => {
    cartPopup.style.display = "none";
  });

  // Add item to cart
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const itemName = button.getAttribute("data-name");
      const itemPrice = parseFloat(button.getAttribute("data-price"));

      if (!cart[itemName]) {
        cart[itemName] = { quantity: 1, price: itemPrice };
      } else {
        cart[itemName].quantity += 1;
      }

      updateCartDisplay();
    });
  });

  // Update Cart Display
  function updateCartDisplay() {
    cartItemsList.innerHTML = "";
    let total = 0;

    Object.entries(cart).forEach(([name, { quantity, price }]) => {
      total += quantity * price;
      const listItem = document.createElement("li");
      listItem.innerHTML = `${name} - ${quantity} x ${price.toFixed(2)} MZN 
      <button class="increase" data-name="${name}">+</button>
      <button class="decrease" data-name="${name}">-</button>`;
      cartItemsList.appendChild(listItem);
    });

    cartTotal.innerText = `Total: ${total.toFixed(2)} MZN`;

    attachQuantityHandlers();
  }

  // Attach quantity controls (+ and - buttons)
  function attachQuantityHandlers() {
    document.querySelectorAll(".increase").forEach((button) => {
      button.addEventListener("click", () => {
        cart[button.getAttribute("data-name")].quantity++;
        updateCartDisplay();
      });
    });

    document.querySelectorAll(".decrease").forEach((button) => {
      button.addEventListener("click", () => {
        const itemName = button.getAttribute("data-name");
        if (cart[itemName].quantity > 1) {
          cart[itemName].quantity--;
        } else {
          delete cart[itemName];
        }
        updateCartDisplay();
      });
    });
  }
});