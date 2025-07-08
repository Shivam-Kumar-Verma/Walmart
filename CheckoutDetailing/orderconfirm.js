// orderconfirm.js

// Optionally generate a random order number if required.
function generateOrderNumber() {
  const orderNumber = "#WM-" + new Date().getFullYear() + "-" + Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  document.getElementById("orderNumber").textContent = orderNumber;
}

// Continue Shopping
document.getElementById("continueShopping").addEventListener("click", function () {
  // Add loading indicator if desired
  this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Redirecting...';
  setTimeout(function () {
    window.location.href = "../econew.html";
  }, 1000);
});

// View Order Details
document.getElementById("viewDetails").addEventListener("click", function () {
  this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
  setTimeout(function () {
    window.location.href = "../orderHistory.html";
  }, 1000);
});

// Auto generate an order number on page load
document.addEventListener("DOMContentLoaded", () => {
  generateOrderNumber();
});
