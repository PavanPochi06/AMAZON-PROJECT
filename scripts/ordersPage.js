import { getProduct, loadProductsFetch } from "../data/products.js";
import { getDeliveryOption } from "../data/deliveryOptions.js";
import { formatCurrency } from "./utils/money.js";
import { calculateCartQuantity } from "../data/cart.js";

async function initOrdersPage() {
  // Load products first
  await loadProductsFetch();
  renderHeader();
  renderOrdersPage();
}

function renderHeader() {
  const cartQuantity = calculateCartQuantity();
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
  document.getElementById("amazon-header-container").innerHTML = headerHTML;
}

export function renderOrdersPage() {
  // Load orders from localStorage
  const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];

  let contentHTML = "";

  if (storedOrders.length === 0) {
    contentHTML = `
      <div class="main">
        <div class="page-title">Your Orders</div>
        <div style="text-align: center; padding: 40px; font-size: 18px; color: #666;">
          No orders yet. <a href="amazon.html" style="color: #0066c0;">Start shopping</a>
        </div>
      </div>
    `;
  } else {
    contentHTML = `
      <div class="main">
        <div class="page-title">Your Orders</div>
        <div class="orders-grid">
    `;

    // Loop through each order
    storedOrders.forEach((order, orderIndex) => {
      const orderDate = new Date(order.orderTime);
      const orderDateString = orderDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Calculate order total
      let orderTotal = 0;
      order.products.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        if (product) {
          orderTotal += product.priceCents * cartItem.quantity;
        }
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        orderTotal += deliveryOption.priceCents;
      });

      contentHTML += `
        <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderDateString}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Order Total:</div>
                <div>$${formatCurrency(orderTotal)}</div>
              </div>
            </div>
            <div class="order-header-right-section">
              <div class="order-header-label">Order ID: ${order.id}</div>
              <button class="delete-order-button" data-order-index="${orderIndex}">
                Delete Order
              </button>
            </div>
          </div>

          <div class="order-details-grid">
      `;

      // Add products in the order
      order.products.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);

        if (!product) {
          return;
        }

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        const deliveryDate = new Date(
          orderDate.getTime() +
            deliveryOption.deliveryDays * 24 * 60 * 60 * 1000,
        );
        const deliveryDateString = deliveryDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        contentHTML += `
          <div class="product-image-container">
            <img src="${product.image}">
          </div>
          <div class="product-details">
            <div class="product-name">${product.name}</div>
            <div class="product-delivery-date">
              Arriving on ${deliveryDateString}
            </div>
            <div class="product-quantity">Quantity: ${cartItem.quantity}</div>
          </div>
          <div class="product-actions">
            <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
              <button class="track-package-button">
                Track package
              </button>
            </a>
          </div>
        `;
      });

      contentHTML += `
          </div>
        </div>
      `;
    });

    contentHTML += `
        </div>
      </div>
    `;
  }

  document.getElementById("orders-content-container").innerHTML = contentHTML;

  // Add event listeners for delete buttons
  document.querySelectorAll(".delete-order-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const orderIndex = parseInt(e.target.getAttribute("data-order-index"));
      deleteOrder(orderIndex);
    });
  });
}

function deleteOrder(orderIndex) {
  const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];

  if (confirm("Are you sure you want to delete this order?")) {
    storedOrders.splice(orderIndex, 1);
    localStorage.setItem("orders", JSON.stringify(storedOrders));
    renderOrdersPage();
  }
}

// Initialize the page
initOrdersPage();
