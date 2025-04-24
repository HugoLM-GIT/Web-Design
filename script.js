document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || {}; // Load cart from localStorage
  let cartCount = parseInt(localStorage.getItem("cartCount")) || 0; // Load cart count

  const cartPopup = document.getElementById("cart-popup");
  const cartItemsList = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const confirmPaymentButton = document.getElementById("confirm-payment-button");
  const cartStatus = document.getElementById("cart-status");
  const cartCountDisplay = document.getElementById("cart-count"); // Cart count display

  cartCountDisplay.textContent = cartCount; // Initialize cart count

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

      cartCount++; // Increase cart count
      cartCountDisplay.textContent = cartCount; // Update cart icon

      localStorage.setItem("cart", JSON.stringify(cart)); // Persist cart items
      localStorage.setItem("cartCount", cartCount); // Persist cart count

      updateCartDisplay();
    });
  });

  // Confirm Payment Button Functionality
  confirmPaymentButton.addEventListener("click", () => {
    confirmPaymentButton.textContent = "Processing...";
    confirmPaymentButton.disabled = true;

    setTimeout(() => {
      cartStatus.textContent = "Payment successful! Your order is being prepared.";
      confirmPaymentButton.classList.add("hidden");

      localStorage.removeItem("cart"); // Clear cart
      localStorage.removeItem("cartCount"); // Clear cart count
      cartCount = 0;
      cartCountDisplay.textContent = cartCount;

      updateCartDisplay();
    }, 2000);
  });

  function updateOrderStatus() {
    const orderStatusMessage = document.getElementById("order-status-message");
    const orderTracking = document.getElementById("order-tracking");

    orderTracking.classList.remove("hidden");

    const statuses = [
      "Order Confirmed ✅",
      "Preparing your meal... 🍽️",
      "Cooking in progress... 🔥",
      "Almost ready! 🍲",
      "Ready for pickup/delivery! 🚀"
    ];

    let currentStep = 0;

    const statusInterval = setInterval(() => {
      if (currentStep < statuses.length) {
        orderStatusMessage.textContent = statuses[currentStep];
        currentStep++;
      } else {
        clearInterval(statusInterval);
      }
    }, 3000);
  }

  setTimeout(() => {
    updateOrderStatus();
  }, 2000);

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
