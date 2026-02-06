import { getProduct, loadProductsFetch } from "../data/products.js";
import { getDeliveryOption } from "../data/deliveryOptions.js";
import { calculateCartQuantity } from "../data/cart.js";

async function initTrackingPage() {
  // Load products
  await loadProductsFetch();

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("orderId");
  const productId = urlParams.get("productId");

  if (!orderId || !productId) {
    document.body.innerHTML = `
      <div class="main">
        <p>Invalid tracking link. <a href="orders.html">Return to orders</a></p>
      </div>
    `;
    return;
  }

  // Get the order from localStorage
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    document.body.innerHTML = `
      <div class="main">
        <p>Order not found. <a href="orders.html">Return to orders</a></p>
      </div>
    `;
    return;
  }

  // Get the product from the order
  const cartItem = order.products.find((p) => p.productId === productId);
  const product = getProduct(productId);

  if (!product || !cartItem) {
    document.body.innerHTML = `
      <div class="main">
        <p>Product not found in order. <a href="orders.html">Return to orders</a></p>
      </div>
    `;
    return;
  }

  // Render the tracking page
  renderTrackingPage(order, product, cartItem);
}

function calculateShippingStatus(orderDate, deliveryDays) {
  const currentDate = new Date();

  // Reset time to midnight for accurate day comparison
  currentDate.setHours(0, 0, 0, 0);
  const orderDateOnly = new Date(orderDate);
  orderDateOnly.setHours(0, 0, 0, 0);

  // Calculate delivery date
  const deliveryDate = new Date(orderDateOnly);
  deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

  // Calculate days elapsed since order
  const daysElapsed = Math.floor(
    (currentDate.getTime() - orderDateOnly.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Determine status and progress
  let status = "Preparing";
  let progressBar = 0;

  if (currentDate >= deliveryDate) {
    // Delivered
    status = 2; // Index for delivered
    progressBar = 100;
  } else if (daysElapsed >= Math.ceil(deliveryDays / 2)) {
    // Shipped
    status = 1; // Index for shipped
    progressBar = Math.min(66, (daysElapsed / deliveryDays) * 100);
  } else {
    // Preparing
    status = 0; // Index for preparing
    progressBar = Math.max(1, (daysElapsed / deliveryDays) * 100);
  }

  return { status, progressBar, deliveryDate };
}

function renderTrackingPage(order, product, cartItem) {
  const cartQuantity = calculateCartQuantity();

  const orderDate = new Date(order.orderTime);
  const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
  const deliveryDays = deliveryOption.deliveryDays;

  // Calculate shipping status based on current date
  const {
    status: currentStatusIndex,
    progressBar,
    deliveryDate,
  } = calculateShippingStatus(orderDate, deliveryDays);

  const deliveryDateString = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const statusLabels = ["Preparing", "Shipped", "Delivered"];
  const currentStatusLabel = statusLabels[currentStatusIndex];

  const headerHTML = `
    <div class="amazon-header">
      <div class="amazon-header-left-section">
        <a href="amazon.html" class="header-link">
          <img class="amazon-logo" src="images/amazon-logo-white.png">
          <img class="amazon-mobile-logo" src="images/amazon-mobile-logo-white.png">
        </a>
      </div>

      <div class="amazon-header-middle-section">
        <input class="search-bar" type="text" placeholder="Search">
        <button class="search-button">
          <img class="search-icon" src="images/icons/search-icon.png">
        </button>
      </div>

      <div class="amazon-header-right-section">
        <a class="orders-link header-link" href="orders.html">
          <span class="returns-text">Returns</span>
          <span class="orders-text">& Orders</span>
        </a>

        <a class="cart-link header-link" href="checkout.html">
          <img class="cart-icon" src="images/icons/cart-icon.png">
          <div class="cart-quantity">${cartQuantity}</div>
          <div class="cart-text">Cart</div>
        </a>
      </div>
    </div>
  `;

  const contentHTML = `
    <div class="main">
      <div class="order-tracking">
        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on ${deliveryDateString}
        </div>

        <div class="product-info">
          ${product.name}
        </div>

        <div class="product-info">
          Quantity: ${cartItem.quantity}
        </div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
          <div class="progress-label ${currentStatusIndex >= 0 ? "current-status" : ""}">
            Preparing
          </div>
          <div class="progress-label ${currentStatusIndex >= 1 ? "current-status" : ""}">
            Shipped
          </div>
          <div class="progress-label ${currentStatusIndex >= 2 ? "current-status" : ""}">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${progressBar}%"></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("amazon-header-container").innerHTML = headerHTML;
  document.getElementById("tracking-content-container").innerHTML = contentHTML;
}

// Initialize the page
initTrackingPage();
