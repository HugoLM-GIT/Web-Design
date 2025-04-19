document.addEventListener("DOMContentLoaded", () => {
  const cart = {}; // Stores items as { name: { quantity, price } }
  const cartPopup = document.getElementById("cart-popup");
  const cartItemsList = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const confirmPaymentButton = document.getElementById("confirm-payment-button"); // New Confirm Payment Button
  const cartStatus = document.getElementById("cart-status"); // Status Message

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

  // Confirm Payment Button Functionality
  confirmPaymentButton.addEventListener("click", () => {
    confirmPaymentButton.textContent = "Processing...";
    confirmPaymentButton.disabled = true;

    setTimeout(() => {
      cartStatus.textContent = "Payment successful! Your order is being prepared.";
      confirmPaymentButton.classList.add("hidden"); // Hide button after confirmation
    }, 2000);
  });
  function updateOrderStatus() {
    const orderStatusMessage = document.getElementById("order-status-message");
    const orderTracking = document.getElementById("order-tracking");
  
    // Show tracking section
    orderTracking.classList.remove("hidden");
  
    // Define status steps
    const statuses = [
      "Order Confirmed ✅",
      "Preparing your meal... 🍽️",
      "Cooking in progress... 🔥",
      "Almost ready! 🍲",
      "Ready for pickup/delivery! 🚀"
    ];
  
    let currentStep = 0;
  
    // Update status every 3 seconds
    const statusInterval = setInterval(() => {
      if (currentStep < statuses.length) {
        orderStatusMessage.textContent = statuses[currentStep];
        currentStep++;
      } else {
        clearInterval(statusInterval); // Stop updating when final status is reached
      }
    }, 3000);
  }
  
  // Call updateOrderStatus after payment is confirmed
  setTimeout(() => {
    updateOrderStatus(); // Start tracking after payment success
  }, 2000);
  
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
        const itemName = button.getAttribute("data-name");
        if (cart[itemName]) {
          cart[itemName].quantity++;
          updateCartDisplay();
        }
      });
    });

    document.querySelectorAll(".decrease").forEach((button) => {
      button.addEventListener("click", () => {
        const itemName = button.getAttribute("data-name");
        if (cart[itemName]) {
          if (cart[itemName].quantity > 1) {
            cart[itemName].quantity--;
          } else {
            delete cart[itemName];
          }
          updateCartDisplay();
        }
      });
    });
  }
  /* Waiter Dashboard Logic */
document.addEventListener("DOMContentLoaded", function () {
  const orderList = document.getElementById("orders");
  const markServedButton = document.getElementById("mark-served");

  function updateOrders() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    orderList.innerHTML = "";
    cartItems.forEach((item, index) => {
      const orderItem = document.createElement("li");
      orderItem.textContent = `${item.name} - ${item.price}MZN`;
      orderItem.dataset.index = index;
      orderList.appendChild(orderItem);
    });
  }

  markServedButton.addEventListener("click", function () {
    localStorage.removeItem("cart");
    orderList.innerHTML = "<p>All orders served!</p>";
  });

  updateOrders();
});

});
