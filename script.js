document.addEventListener("DOMContentLoaded", () => {
  console.log("Digital Menu Website Loaded!");

  // Search bar functionality (already implemented)
  const searchBar = document.getElementById("search-bar");
  const dishes = document.querySelectorAll("section div");

  searchBar.addEventListener("input", (event) => {
    const searchText = event.target.value.toLowerCase();

    dishes.forEach(dish => {
      const text = dish.textContent.toLowerCase();
      if (text.includes(searchText)) {
        dish.style.display = "block";
      } else {
        dish.style.display = "none";
      }
    });
  });

  console.log("Search functionality initialized!");

  // Vegetarian filter functionality (already implemented)
  const vegetarianButton = document.getElementById("vegetarian");

  vegetarianButton.addEventListener("click", () => {
    dishes.forEach(dish => {
      if (dish.textContent.toLowerCase().includes("vegetarian")) {
        dish.style.display = "block";
      } else {
        dish.style.display = "none";
      }
    });
  });

  console.log("Vegetarian filter functionality initialized!");

  // Cart functionality
  const cartButton = document.getElementById("cart-button");
  const cartTotal = document.getElementById("cart-total");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  let totalAmount = 0;

  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const price = parseFloat(button.getAttribute("data-price"));
      const name = button.getAttribute("data-name");

      totalAmount += price;

      alert(`${name} has been added to your cart!`);
      cartTotal.textContent = `Total: ${totalAmount.toFixed(2)} MZN`;
    });
  });

  cartButton.addEventListener("click", () => {
    alert(`Your total is ${totalAmount.toFixed(2)} MZN.`);
  });

  console.log("Cart functionality initialized!");
});
