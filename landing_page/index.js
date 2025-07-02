/** @format */
import { fetchdata } from './components/fetch.js'; // Fixed path
import { navbar, hjjk } from './nav.js';
import { footer } from './footer.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load navbar and footer
  const navbarContainer = document.querySelector('#navbar-container');
  const footerContainer = document.querySelector('#footer-container');
  
  if (navbarContainer) {
    navbarContainer.innerHTML = navbar();
  }
  
  if (footerContainer) {
    footerContainer.innerHTML = footer();
  }
  
  // Initialize user info after navbar is loaded
  hjjk();
  
  // Setup search functionality after navbar is loaded
  setupSearch();
  
  // Initialize slider functionality
  initializeSlider();
  
  // Load data
  loadCartItems();
  loadRollbackItems();
});

function setupSearch() {
  const searchButton = document.querySelector('.search-button');
  const searchInput = document.querySelector('.search-bar input');
  
  if (searchButton && searchInput) {
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
}

function performSearch() {
  const searchInput = document.querySelector('.search-bar input');
  const searchValue = searchInput.value.trim();
  
  if (searchValue) {
    let url = `https://mock-server-gv8m.onrender.com/porducts?q=${searchValue}`;
    console.log(url);
    
    fetchdata(url)
      .then(function (data) {
        console.log(data);
        if (data.length != 0) {
          localStorage.setItem('search', JSON.stringify(data));
          window.location.href = 'product.html';
        } else {
          console.log('no such product');
          alert('No products found for your search.');
        }
      })
      .catch(function (error) {
        console.error('Search error:', error);
      });
  }
}

function initializeSlider() {
  // Auto slider
  setInterval(function () {
    const sliders = document.getElementsByClassName('slider');
    if (sliders.length === 0) return;
    
    if (sliders[0].classList.contains('active')) {
      sliders[1].classList.add('active');
      sliders[0].classList.remove('active');
    } else if (sliders[1].classList.contains('active')) {
      sliders[2].classList.add('active');
      sliders[1].classList.remove('active');
    } else if (sliders[2].classList.contains('active')) {
      sliders[0].classList.add('active');
      sliders[2].classList.remove('active');
    }
  }, 3000);
}

// Make functions global for button clicks
window.next = function() {
  const sliders = document.getElementsByClassName('slider');
  if (sliders.length === 0) return;
  
  if (sliders[0].classList.contains('active')) {
    sliders[1].classList.add('active');
    sliders[0].classList.remove('active');
  } else if (sliders[1].classList.contains('active')) {
    sliders[2].classList.add('active');
    sliders[1].classList.remove('active');
  } else if (sliders[2].classList.contains('active')) {
    sliders[0].classList.add('active');
    sliders[2].classList.remove('active');
  }
};

window.prev = function() {
  const sliders = document.getElementsByClassName('slider');
  if (sliders.length === 0) return;
  
  if (sliders[0].classList.contains('active')) {
    sliders[2].classList.add('active');
    sliders[0].classList.remove('active');
  } else if (sliders[2].classList.contains('active')) {
    sliders[1].classList.add('active');
    sliders[2].classList.remove('active');
  } else if (sliders[1].classList.contains('active')) {
    sliders[0].classList.add('active');
    sliders[1].classList.remove('active');
  }
};

function rollback(rollbackItems) {
  const rollback_cards = document.getElementById('rollback-cards');
  if (!rollback_cards) return;
  
  rollback_cards.innerHTML = ''; // Clear existing content
  
  rollbackItems.forEach(function (item) {
    console.log(item);
    var imgDiv = document.createElement('div');
    imgDiv.setAttribute('id', 'card');

    var text = document.createElement('div');
    text.setAttribute('id', 'text');

    var img = document.createElement('img');
    img.setAttribute('src', item.Product_imgUrl || item.img_url);

    var price = document.createElement('h2');
    price.setAttribute('id', 'price');
    price.textContent = '$' + (item.List_Price || item.price);

    var type = document.createElement('p');
    type.setAttribute('id', 'type');
    type.textContent = item.Product_Name || item.type;

    var btn = document.createElement('button');
    btn.setAttribute('id', 'shippingBtn');
    btn.textContent = '3+ day shipping';

    var h3 = document.createElement('div');
    h3.setAttribute('id', 'ratings');
    h3.innerHTML = `<p>&#9734; ${item.rating}</p>`;

    var pDiv = document.createElement('div');
    pDiv.setAttribute('class', 'pDiv');
    pDiv.append(type);

    var button = document.createElement('button');
    button.setAttribute('id', 'btn');
    button.textContent = 'Options';

    button.addEventListener('click', function () {
      addtoCart(item);
    });

    text.append(pDiv, price);
    imgDiv.append(img, button, text);
    rollback_cards.append(imgDiv);
  });
}

function displayItems(cartItems) {
  let cart_card = document.getElementById('cart-card');
  if (!cart_card) return;
  
  cart_card.innerHTML = ''; // Clear existing content
  
  cartItems.forEach(function (items) {
    console.log(items);

    let box = document.createElement('div');
    box.setAttribute('id', 'box');

    let img = document.createElement('img');
    img.src = items.Product_imgUrl || items.img_url;
    img.addEventListener('click', function() {
      localStorage.setItem('detail_me', JSON.stringify(items));
    });

    let btn = document.createElement('button');
    btn.setAttribute('id', 'addToCart');
    btn.textContent = '+ Add';
    btn.addEventListener('click', () => {
      let arr = JSON.parse(localStorage.getItem('product_added')) || [];
      arr.push(items);
      localStorage.setItem('product_added', JSON.stringify(arr));
    });

    let price = document.createElement('h2');
    price.textContent = '$' + (items.List_Price || items.price);

    let title = document.createElement('h4');
    title.textContent = items.Product_Name || items.type;

    let delivery = document.createElement('div');
    delivery.setAttribute('id', 'deliveryInfo');

    let pickupBtn = document.createElement('p');
    pickupBtn.setAttribute('id', 'pickupBtns');
    pickupBtn.textContent = 'Pickup';

    let deliveryBtn = document.createElement('p');
    deliveryBtn.setAttribute('id', 'deliveryBtns');
    deliveryBtn.textContent = 'Delivery';

    delivery.append(pickupBtn, deliveryBtn);
    box.append(img, btn, price, title, delivery);
    cart_card.append(box);
  });
}

function loadCartItems() {
  let url = `https://mock-server-gv8m.onrender.com/cartItems`;
  fetchdata(url)
    .then(function (data) {
      console.log(data);
      displayItems(data);
    })
    .catch(function (error) {
      console.error('Error loading cart items:', error);
    });
}

function loadRollbackItems() {
  let urll = `https://mock-server-gv8m.onrender.com/rollbackItems`;
  fetchdata(urll)
    .then(function (data) {
      console.log(data);
      rollback(data);
    })
    .catch(function (error) {
      console.error('Error loading rollback items:', error);
    });
}

// Placeholder function for addtoCart
function addtoCart(item) {
  console.log('Adding to cart:', item);
  // Implement your cart functionality here
}