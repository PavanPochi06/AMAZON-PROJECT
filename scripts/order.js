import { cart, clearCart } from "../data/cart.js";
import { getProduct } from "../data/products.js";
import { getDeliveryOption } from "../data/deliveryOptions.js";
import { formatCurrency } from "./utils/money.js";
import { addOrder, orders } from "../data/orders.js";

export function initPlaceOrderButton() {
  const placeOrderButton = document.querySelector(".js-place-order");

  if (placeOrderButton) {
    placeOrderButton.addEventListener("click", async () => {
      try {
        // Send order to backend
        const response = await fetch("https://supersimplebackend.dev/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart: cart,
          }),
        });

        const backendOrder = await response.json();

        // Ensure the order has all the cart details with delivery options
        const completeOrder = {
          ...backendOrder,
          products: cart, // Use cart data to preserve delivery options
        };

        addOrder(completeOrder);

        // Clear the cart
        clearCart();

        // Show "Order Placed!" message
        placeOrderButton.innerText = "Order Placed!";
        placeOrderButton.disabled = true;
        placeOrderButton.style.backgroundColor = "#28a745";

        // After 2 seconds, redirect to orders page
        setTimeout(() => {
          window.location.href = "orders.html";
        }, 2000);
      } catch (error) {
        console.log("Unexpected error. Please try again later.");
        console.error(error);
      }
    });
  }
}
