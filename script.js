document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;
  let orderID = localStorage.getItem("orderID") || generateOrderID();
  let timerInterval; // Global variable to control countdown

  const cartPopup = document.getElementById("cart-popup");
  const cartItemsList = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const confirmPaymentButton = document.getElementById("confirm-payment-button");
  const cartStatus = document.getElementById("cart-status");
  const cartCountDisplay = document.getElementById("cart-count");
  const clearCartButton = document.getElementById("clear-cart");
  const editOrderButton = document.getElementById("edit-order");
  const orderStatusMessage = document.getElementById("order-status-message");
  const orderTracking = document.getElementById("order-tracking");
  const paymentPopup = document.getElementById("payment-popup");
  const paymentOptions = document.querySelectorAll(".payment-option");
  const closePaymentPopup = document.getElementById("close-payment-popup");
  const searchBar = document.getElementById("search-bar");
  const searchButton = document.getElementById("search-button");

  cartCountDisplay.textContent = cartCount;

  function generateOrderID() {
      return "ORD-" + Math.floor(Math.random() * 1000000);
  }

  document.getElementById("cart-icon").addEventListener("click", () => {
      cartPopup.style.display = "block";
      cartPopup.classList.add("show-cart");
      updateCartDisplay();
  });

  document.getElementById("close-cart").addEventListener("click", () => {
      cartPopup.classList.remove("show-cart");
      setTimeout(() => {
          cartPopup.style.display = "none";
      }, 300);
  });

  confirmPaymentButton.addEventListener("click", () => {
      paymentPopup.style.display = "block";
  });

  closePaymentPopup.addEventListener("click", () => {
      paymentPopup.style.display = "none";
  });

  paymentOptions.forEach((button) => {
      button.addEventListener("click", () => {
          const selectedMethod = button.getAttribute("data-method");

          orderID = generateOrderID();
          localStorage.setItem("orderID", orderID);

          cartStatus.innerHTML = `Payment via ${selectedMethod} initiated.<br>New Order ID: <strong>${orderID}</strong>`;
          paymentPopup.style.display = "none";

          updateOrderStatus(); // Start a new countdown
      });
  });

  document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", () => {
          const itemName = button.getAttribute("data-name");
          const itemPrice = parseFloat(button.getAttribute("data-price"));

          if (!cart[itemName]) {
              cart[itemName] = { quantity: 1, price: itemPrice };
          } else {
              cart[itemName].quantity += 1;
          }

          cartCount++;
          cartCountDisplay.textContent = cartCount;

          saveCartState();
          updateCartDisplay();
      });
  });

  editOrderButton.addEventListener("click", () => {
      const previousOrderID = orderID;

      orderID = generateOrderID();
      localStorage.setItem("orderID", orderID);

      cartStatus.innerHTML = `Order modified. Previous Order ID: <s>${previousOrderID}</s> → New Order ID: <strong>${orderID}</strong>`;
      cartPopup.style.display = "block";
      cartPopup.classList.add("show-cart");

      confirmPaymentButton.textContent = "Confirm Payment";
      confirmPaymentButton.disabled = false;

      updateCartDisplay();
  });

  clearCartButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to empty the cart?")) {
          localStorage.removeItem("cart");
          localStorage.removeItem("cartCount");
          localStorage.removeItem("orderID");

          cartItemsList.innerHTML = "";
          cartTotal.innerText = "Total: 0 MZN";
          cartCount = 0;
          cartCountDisplay.textContent = cartCount;
          orderID = generateOrderID();

          cartStatus.textContent = "Cart emptied. Start fresh.";
          orderStatusMessage.textContent = "Order canceled.";
          orderTracking.classList.add("hidden");

          confirmPaymentButton.textContent = "Confirm Payment";
          confirmPaymentButton.disabled = false;

          clearInterval(timerInterval); // Stop all countdowns
      }
  });

  function updateOrderStatus() {
      clearInterval(timerInterval); // Ensure previous countdown is stopped

      orderTracking.classList.remove("hidden");

      let totalTime = 5;
      Object.entries(cart).forEach(([name]) => {
          if (name.includes("Frango") || name.includes("Batata Frita")) {
              totalTime = Math.max(totalTime, 7);
          }
          if (name.includes("Carne Borrego")) {
              totalTime = Math.max(totalTime, 10);
          }
      });

      let remainingTime = totalTime * 60;

      timerInterval = setInterval(() => {
          if (remainingTime > 0) {
              const minutes = Math.floor(remainingTime / 60);
              const seconds = remainingTime % 60;
              orderStatusMessage.textContent = `Preparing your meal... ⏳ ${minutes} min ${seconds} sec left`;
              remainingTime--;
          } else {
              orderStatusMessage.textContent = "Ready for pickup/delivery.";
              clearInterval(timerInterval);
          }
      }, 1000);
  }

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
                  saveCartState();
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
                  saveCartState();
                  updateCartDisplay();
              }
          });
      });
  }

  function saveCartState() {
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("cartCount", cartCount);
  }

  // Search Functionality using Magnifying Glass Button
  searchButton.addEventListener("click", () => {
      performSearch();
  });

  function performSearch() {
      const searchQuery = searchBar.value.toLowerCase();
      const dishes = document.querySelectorAll(".dish");

      let found = false;

      dishes.forEach((dish) => {
          const dishName = dish.querySelector("p").textContent.toLowerCase();
          if (dishName.includes(searchQuery)) {
              dish.style.display = "block"; 
              found = true;
          } else {
              dish.style.display = "none"; 
          }
      });

      if (!found) {
          alert("No items found for your search.");
      }
  }
});
