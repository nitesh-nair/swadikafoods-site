lucide.createIcons();

const whatsappNumber = "9745933300";

// Load products from JSON
async function loadProducts() {
  try {
    const response = await fetch("products.json");
    const products = await response.json();
    displayProducts(products);
    updateCartUI();
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

// Display products in the store
function displayProducts(products) {
  const productsGrid = document.getElementById("products-grid");
  if (!productsGrid) return console.error("Error: #products-grid not found");

  productsGrid.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <h3>${product.name}</h3>
      <p class="product-price">₹${product.price.toFixed(2)}</p>
      <div id="cart-controls-${product.id}" class="cart-controls" data-stock="${product.stock}">
        ${getCartControlHTML(product.id, product.stock)}
      </div>
    `;
    productsGrid.appendChild(productCard);
  });

  lucide.createIcons();
}

// Generate Add to Cart / Quantity Controls UI
function getCartControlHTML(id, stock) {
  let cart = getCart();
  let item = cart[id] || { quantity: 0 };

  if (item.quantity > 0) {
    return `
      <div class="cart-quantity">
        <button onclick="changeQuantity('${id}', -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity('${id}', 1)">+</button>
      </div>
    `;
  } else {
    return `
      <button class="buy-button" onclick="addToCart('${id}', ${stock})">
        <i data-lucide="shopping-cart"></i> Add to Cart
      </button>
    `;
  }
}

// Add to Cart
function addToCart(id, stock) {
  let cart = getCart();

  if (!cart[id]) {
    cart[id] = { quantity: 1, stock: stock };
  } else if (cart[id].quantity < stock) {
    cart[id].quantity++;
  }

  saveCart(cart);
  updateCartUI();
}

// Remove from Cart
function removeFromCart(id) {
  let cart = getCart();
  delete cart[id];
  saveCart(cart);
  updateCartUI();
}

// Change Item Quantity
function changeQuantity(id, change) {
  let cart = getCart();
  
  const controlElement = document.getElementById(`cart-controls-${id}`);
  const stock = controlElement ? parseInt(controlElement.dataset.stock) : cart[id]?.stock || 10;

  if (cart[id]) {
    cart[id].quantity += change;
    cart[id].stock = stock;

    if (cart[id].quantity <= 0) {
      delete cart[id];
    }

    saveCart(cart);
    updateCartUI();
  }
}

// Update Cart UI
function updateCartUI() {
  let cart = getCart();
  let cartItemsElement = document.getElementById("cart-items");
  let cartTotalElement = document.getElementById("cart-total-price");
  let cartBadge = document.getElementById("cart-badge");
  let whatsappButton = document.getElementById("whatsapp-order-btn");

  if (!cartItemsElement || !cartTotalElement || !cartBadge) {
    console.error("Error: One or more cart elements not found");
    return;
  }

  cartItemsElement.innerHTML = "";

  let totalItems = 0;
  let totalPrice = 0;

  // Get products to access their actual data
  fetch("products.json")
    .then(response => response.json())
    .then(products => {
      const productsMap = {};
      products.forEach(product => {
        productsMap[product.id] = product;
      });

      Object.keys(cart).forEach((id) => {
        let item = cart[id];
        const product = productsMap[id];
        const price = product ? product.price : 100;
        const stock = product ? product.stock : item.stock || 10;
        
        item.stock = stock;
        
        totalItems += item.quantity;
        totalPrice += item.quantity * price;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
          <p>${product ? product.name : `Item ${id}`} (${item.quantity})</p>
          <button onclick="changeQuantity('${id}', -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity('${id}', 1)">+</button>
          <button onclick="removeFromCart('${id}')"><i data-lucide="trash"></i></button>
        `;
        cartItemsElement.appendChild(cartItem);
      });

      cartBadge.textContent = totalItems > 0 ? totalItems : "";
      cartTotalElement.textContent = `₹${totalPrice.toFixed(2)}`;
      
      // Enable or disable WhatsApp checkout button
      if (whatsappButton) {
        whatsappButton.disabled = totalItems === 0;
        //whatsappButton.onclick = totalItems > 0 ? createWhatsAppOrder : null;
      }

      // Update product controls
      document.querySelectorAll(".cart-controls").forEach((control) => {
        const id = control.id.replace("cart-controls-", "");
        const stock = parseInt(control.dataset.stock) || (productsMap[id]?.stock || 10);
        control.innerHTML = getCartControlHTML(id, stock);
      });

      lucide.createIcons();
    })
    .catch(error => {
      console.error("Error fetching products for cart update:", error);
      updateCartUIFallback(cart, cartItemsElement, cartTotalElement, cartBadge, whatsappButton);
    });
}

// Fallback update method if products can't be fetched
function updateCartUIFallback(cart, cartItemsElement, cartTotalElement, cartBadge, whatsappButton) {
  let totalItems = 0;
  let totalPrice = 0;

  Object.keys(cart).forEach((id) => {
    let item = cart[id];
    totalItems += item.quantity;
    totalPrice += item.quantity * 100;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <p>Item ${id} (${item.quantity})</p>
      <button onclick="changeQuantity('${id}', -1)">-</button>
      <span>${item.quantity}</span>
      <button onclick="changeQuantity('${id}', 1)">+</button>
      <button onclick="removeFromCart('${id}')"><i data-lucide="trash"></i></button>
    `;
    cartItemsElement.appendChild(cartItem);
  });

  cartBadge.textContent = totalItems > 0 ? totalItems : "";
  cartTotalElement.textContent = `₹${totalPrice.toFixed(2)}`;
  
  if (whatsappButton) {
    whatsappButton.disabled = totalItems === 0;
    //whatsappButton.onclick = totalItems > 0 ? createWhatsAppOrder : null;
  }

  document.querySelectorAll(".cart-controls").forEach((control) => {
    const id = control.id.replace("cart-controls-", "");
    const stock = parseInt(control.dataset.stock) || cart[id]?.stock || 10;
    control.innerHTML = getCartControlHTML(id, stock);
  });

  lucide.createIcons();
}

// Toggle Cart Sidebar (This matches your HTML onclick attribute)
function toggleCart() {
  console.log("Toggle cart called");
  let cartSidebar = document.getElementById("cart-sidebar");
  if (cartSidebar) {
    cartSidebar.classList.toggle("open");
    console.log("Cart sidebar toggled");
  } else {
    console.error("Cart sidebar element not found!");
  }
}

// Create WhatsApp Order
function createWhatsAppOrder() {
  let cart = getCart();
  let orderMessage = "Hello! I would like to place an order:\n\n";
  
  fetch("products.json")
    .then(response => response.json())
    .then(products => {
      const productsMap = {};
      products.forEach(product => {
        productsMap[product.id] = product;
      });
      
      let totalAmount = 0;
      
      // Build the order message
      Object.keys(cart).forEach((id) => {
        const product = productsMap[id];
        const item = cart[id];
        const productName = product ? product.name : `Item ${id}`;
        const price = product ? product.price : 100;
        const itemTotal = item.quantity * price;
        
        orderMessage += `${productName} x ${item.quantity} = ₹${itemTotal.toFixed(2)}\n`;
        totalAmount += itemTotal;
      });
      
      orderMessage += `\nTotal Amount: ₹${totalAmount.toFixed(2)}`;
      
      // Encode the message for WhatsApp
      const encodedMessage = encodeURIComponent(orderMessage);
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      // Open WhatsApp
      window.open(whatsappLink, '_blank');
    })
    .catch(error => {
      console.error("Error creating WhatsApp order:", error);
      alert("Sorry, there was an error creating your order. Please try again.");
    });
}

// Clear Cart
function clearCart() {
  localStorage.removeItem("cart");
  updateCartUI();
}

// Get Cart from Local Storage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || {};
}

// Save Cart to Local Storage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

//Load products on page load
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  
  // WhatsApp checkout button
  // const whatsappButton = document.getElementById("whatsapp-order-btn");
  // if (whatsappButton) {
  //   whatsappButton.addEventListener("click", createWhatsAppOrder);
  // }
  
  // // Prevent cart closing when clicking inside the cart
  // document.getElementById("cart-sidebar")?.addEventListener("click", function(e) {
  //   // Don't stop propagation for close button clicks
  //   if (!e.target.closest(".close-cart")) {
  //     e.stopPropagation();
  //   }
  // });
  
  lucide.createIcons();
});

document.addEventListener("DOMContentLoaded", function () {
  const checkoutBtn = document.getElementById("whatsapp-order-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      window.location.href = "checkout.html";
    });
  }
});
