/** @format */

function navbar() {
  return `
  <div id="full">
    <div class="top-bar">
      <div class="pickup-delivery">
        <span class="material-symbols-outlined">local_shipping</span>
        <div>
          Pickup or delivery?
          <div class="location-info">
            Sacramento, 95829 &nbsp;•&nbsp; Sacramento Supercenter
          </div>
          <span class="material-symbols-outlined arrow-down">expand_more</span>
        </div>
      </div>
      <div class="search-bar">
        <input
          type="text"
          placeholder="Search everything at Walmart online and in store"
          aria-label="Search"
        />
        <button class="search-button">
          <span class="material-symbols-outlined">search</span>
        </button>
      </div>
      <div class="right-menu">
        <div class="wishlist">
          <span class="material-symbols-outlined">favorite_border</span>
          <span>Reorder My Items</span>
        </div>
        <div class="account">
          <span class="material-symbols-outlined">person_outline</span>
          <a href="signup.html">Sign In Account</a>
        </div>
        <div class="cart">
          <a href="CheckoutDetailing/cart.html">
            <span class="material-symbols-outlined">shopping_cart</span>
            <span class="cart-badge">0</span>
            <span class="cart-total">$0.00</span>
          </a>
        </div>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="menu-item departments">
        <span class="material-symbols-outlined">apps</span>
        <span>Departments</span>
        <span class="material-symbols-outlined arrow-down">expand_more</span>
      </div>
      <div class="menu-item services">
        <span class="material-symbols-outlined">miscellaneous_services</span>
        <span>Services</span>
        <span class="material-symbols-outlined arrow-down">expand_more</span>
      </div>
      <div class="menu-item">Get it Fast</div>
      <div class="menu-item">My Items</div>
      <div class="menu-item">Pharmacy Delivery</div>
      <div class="menu-item">Dinner Solutions</div>
      <div class="menu-item">4th of July</div>
      <div class="menu-item">Trending</div>
      <div class="menu-item">Swim Shop</div>
      <div class="menu-item">Walmart+</div>
      <div class="menu-item more">
        More
        <span class="material-symbols-outlined arrow-down">expand_more</span>
      </div>
    </div>
  </div>
  `;
}

let user = JSON.parse(localStorage.getItem('user_data')) || [];
function hjjk() {
  console.log('dssd');
  if (user.length != 0) {
    let username = ' ' + user[0].signup_form_fname;
    let sda = document.querySelector('#us');
    sda.innerHTML = '';
    sda.append('Hi,', username);
  }
}

export { navbar, hjjk };
