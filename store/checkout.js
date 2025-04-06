document.addEventListener("DOMContentLoaded", function () {
  displayCartSummary();

  // Add form validation
  const checkoutForm = document.querySelector(".checkout-form form");
  const formInputs = checkoutForm.querySelectorAll("input, textarea");

  // Add validation message elements after each input
  formInputs.forEach((input) => {
    const validationMessage = document.createElement("span");
    validationMessage.className = "error-message";
    validationMessage.style.display = "none";
    input.parentNode.insertBefore(validationMessage, input.nextSibling);

    // Add event listeners for input validation
    input.addEventListener("input", () => {
      validateInput(input);
    });

    input.addEventListener("blur", () => {
      validateInput(input);
    });
  });

  // Handle form submission
  checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let isFormValid = true;

    // Validate all inputs
    formInputs.forEach((input) => {
      if (!validateInput(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      placeOrder();
    }
  });
});

function validateInput(input) {
  const errorMessage = input.nextElementSibling;

  // Reset error state
  input.classList.remove("invalid");
  errorMessage.style.display = "none";

  // Check if input is empty
  if (!input.value.trim()) {
    input.classList.add("invalid");
    errorMessage.textContent = `Please enter your ${
      input.placeholder || input.id.replace("user-", "")
    }`;
    errorMessage.style.display = "block";
    return false;
  }

  // Phone number validation
  if (input.id === "user-phone") {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(input.value.trim())) {
      input.classList.add("invalid");
      errorMessage.textContent = "Please enter a valid 10-digit phone number";
      errorMessage.style.display = "block";
      return false;
    }
  } else if (input.id === "user-pincode") {
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(input.value.trim())) {
      input.classList.add("invalid");
      errorMessage.textContent = "Please enter a valid 6-digit PIN code";
      errorMessage.style.display = "block";
      return false;
    }
  }

  return true;
}

const whatsappNumber = "9745933300";

function displayCartSummary() {
  // Get cart as an object (matching how it's stored in main.js)
  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  const orderSummaryElement = document.getElementById("order-summary");

  if (Object.keys(cart).length === 0) {
    orderSummaryElement.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  // Fetch products to get names and prices
  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      const productsMap = {};
      products.forEach((product) => {
        productsMap[product.id] = product;
      });

      let total = 0;
      let summaryHTML = "<ul>";

      Object.keys(cart).forEach((id) => {
        const item = cart[id];
        const product = productsMap[id];
        const productName = product ? product.name : `Item ${id}`;
        const price = product ? product.price : 100;
        const itemTotal = item.quantity * price;

        total += itemTotal;
        summaryHTML += `<li>${
          item.quantity
        }x ${productName} - ₹${itemTotal.toFixed(2)}</li>`;
      });

      summaryHTML += `</ul><p><strong>Total: ₹${total.toFixed(2)}</strong></p>`;
      orderSummaryElement.innerHTML = summaryHTML;
    })
    .catch((error) => {
      console.error("Error loading products for cart summary:", error);
      displayCartSummaryFallback(cart, orderSummaryElement);
    });
}

function displayCartSummaryFallback(cart, orderSummaryElement) {
  let total = 0;
  let summaryHTML = "<ul>";

  Object.keys(cart).forEach((id) => {
    const item = cart[id];
    const price = 100; // Default price if product data isn't available
    const itemTotal = item.quantity * price;

    total += itemTotal;
    summaryHTML += `<li>${item.quantity}x Item ${id} - ₹${itemTotal.toFixed(
      2
    )}</li>`;
  });

  summaryHTML += `</ul><p><strong>Total: ₹${total.toFixed(2)}</strong></p>`;
  orderSummaryElement.innerHTML = summaryHTML;
}

function createOrderMessage(cart, name, phone, address) {
  let message = `🛒 *Order Details:*\n`;
  let total = 0;

  // Attempt to get product details
  return fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      const productsMap = {};
      products.forEach((product) => {
        productsMap[product.id] = product;
      });

      Object.keys(cart).forEach((id) => {
        const item = cart[id];
        const product = productsMap[id];
        const productName = product ? product.name : `Item ${id}`;
        const price = product ? product.price : 100;
        const itemTotal = item.quantity * price;

        total += itemTotal;
        message += `• ${item.quantity}x ${productName} - ₹${itemTotal.toFixed(
          2
        )}\n`;
      });

      message += `\n*Total: ₹${total.toFixed(2)}*`;
      message += `\n\n📌 *Name:* ${name}\n📞 *Phone:* ${phone}\n📍 *Address:* ${address}`;

      return message;
    })
    .catch((error) => {
      console.error("Error creating order message:", error);
      // Fallback if products can't be loaded
      let fallbackMessage = `🛒 *Order Details:*\n`;
      let total = 0;

      Object.keys(cart).forEach((id) => {
        const item = cart[id];
        const itemTotal = item.quantity * 100; // Default price

        total += itemTotal;
        fallbackMessage += `• ${
          item.quantity
        }x Item ${id} - ₹${itemTotal.toFixed(2)}\n`;
      });

      fallbackMessage += `\n*Total: ₹${total.toFixed(2)}*`;
      fallbackMessage += `\n\n📌 *Name:* ${name}\n📞 *Phone:* ${phone}\n📍 *Address:* ${address} \n *Pincode:* ${pincode}`;

      return fallbackMessage;
    });
}

async function placeOrder() {
  // Get cart as an object
  let cart = JSON.parse(localStorage.getItem("cart")) || {};

  if (Object.keys(cart).length === 0) {
    showMessage("Your cart is empty!", "error");
    return;
  }

  const name = document.getElementById("user-name").value.trim();
  const phone = document.getElementById("user-phone").value.trim();
  const address = document.getElementById("user-address").value.trim();
  const pincode = document.getElementById("user-pincode").value.trim();

  // Form validation handled by validateInput function now

  try {
    // Show loading state
    const orderButton = document.getElementById("place-order-btn");
    const originalButtonText = orderButton.textContent;
    orderButton.textContent = "Processing...";
    orderButton.disabled = true;

    // Wait for the message to be created with product details
    const message = await createOrderMessage(cart, name, phone, address, pincode);

    // Open WhatsApp with the order message
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    // Clear the cart after order is placed
    localStorage.removeItem("cart");

    // Reset button state
    orderButton.textContent = originalButtonText;
    orderButton.disabled = false;

    // Show success message
    showMessage(
      "Order placed successfully! Redirecting to WhatsApp...",
      "success"
    );

    // Optional: Redirect to a thank you page after a delay
    setTimeout(() => {
      window.location.href = "thank-you.html";
    }, 3000);
  } catch (error) {
    console.error("Error placing order:", error);
    showMessage(
      "There was an error placing your order. Please try again.",
      "error"
    );

    // Reset button state
    const orderButton = document.getElementById("place-order-btn");
    orderButton.textContent = "Place Order on WhatsApp";
    orderButton.disabled = false;
  }
}

// Helper function to show messages
function showMessage(message, type) {
  // Check if there's an existing message
  let messageElement = document.querySelector(".message-container");

  if (!messageElement) {
    messageElement = document.createElement("div");
    messageElement.className = "message-container";
    const form = document.querySelector("form");
    form.insertBefore(messageElement, form.firstChild);
  }

  messageElement.textContent = message;
  messageElement.className = `message-container ${type}`;

  // Auto-hide after 5 seconds for success messages
  if (type === "success") {
    setTimeout(() => {
      messageElement.style.display = "none";
    }, 5000);
  }
}
