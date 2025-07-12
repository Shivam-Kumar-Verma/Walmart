// Global variables
let currentSlide = 0;
const slides = document.querySelectorAll('.slider');
const indicators = document.querySelectorAll('.indicator');
let slideInterval;

// Sample data for products
const sampleProducts = {
    continueShopping: [
        {
            id: 1,
            image: "https://i5.walmartimages.com/asr/d40772a4-e87d-4385-a712-b27f1b793697.e046de405bd3e603be4fe45ccce98d5a.jpeg?odnHeight=112&odnWidth=112&odnBg=FFFFFF",
            title: "Wireless Headphones",
            description: "Premium sound quality with noise cancellation",
            price: "$49.99"
        },
        {
            id: 2,
            image: "https://i5.walmartimages.com/asr/104b5bcf-e7da-497b-87f6-0a5a56249d27_1.5c18e44aae7893f3044b2aeeed360603.jpeg?odnHeight=112&odnWidth=112&odnBg=FFFFFF",
            title: "Smart Watch",
            description: "Track your fitness and stay connected",
            price: "$129.99"
        },
        {
            id: 3,
            image: "https://i5.walmartimages.com/asr/61e865fc-df33-4494-ad33-193740b366c5.6c2e4549ab3500f82d172aeb4149c7eb.jpeg?odnHeight=112&odnWidth=112&odnBg=FFFFFF",
            title: "Bluetooth Speaker",
            description: "Portable speaker with amazing bass",
            price: "$39.99"
        },
        {
            id: 4,
            image: "https://i5.walmartimages.com/asr/17187188-5b63-4c91-b9e8-e1d4ed8b1560.e39988e44f9ff3619ecddb8d746ee015.jpeg?odnHeight=112&odnWidth=112&odnBg=FFFFFF",
            title: "Phone Case",
            description: "Protective case for your smartphone",
            price: "$19.99"
        }
    ],
    spookySavings: [
        {
            id: 5,
            image: "https://i5.walmartimages.com/dfw/4ff9c6c9-3bcd/k2-_c566840d-c66f-4eb2-9c30-fd4dfb83a29e.v1.jpg?odnHeight=112&odnWidth=112&odnBg=FFFFFF",
            title: "Flash Picks",
            description: "Up to 50% off on flash picks",
            price: "From $9.99",
            discount: "50% OFF"
        },
        {
            id: 6,
            image: "https://i5.walmartimages.com/dfw/4ff9c6c9-fea3/k2-_24a128d5-72fd-42f2-82a8-80b2ed2e3940.v1.jpg?odnHeight=112&odnWidth=112&odnBg=FFFFFF",
            title: "Home Essentials",
            description: "20% off on home essentials",
            price: "From $14.99",
            discount: "20% OFF"
        },
        {
            id: 7,
            image: "https://i5.walmartimages.com/dfw/4ff9c6c9-42cf/k2-_fbcba533-6996-43ed-8569-239ed21b1775.v1.jpg?odnHeight=112&odnWidth=112&odnBg=FFFFFF",
            title: "Home Improvement",
            description: "15% off on home improvement",
            price: "From $24.99",
            discount: "15% OFF"
        },
        {
            id: 8,
            image: "https://i5.walmartimages.com/dfw/4ff9c6c9-798b/k2-_f6a53e21-8525-4392-8482-9ab31e7fac28.v1.jpg?odnHeight=112&odnWidth=112&odnBg=FFFFFF",
            title: "Fashion",
            description: "60% off on fashion items",
            price: "From $12.99",
            discount: "60% OFF"
        }
    ],
    gifting: [
        {
            id: 9,
            image: "https://i5.walmartimages.com/dfw/4ff9c6c9-2511/k2-_1f9f86dd-5dd6-4ff4-bdd1-8c8cd96bab6f.v1.jpg?odnHeight=290&odnWidth=290&odnBg=FFFFFF",
            title: "Stocking Stuffers",
            description: "Perfect small gifts for everyone",
            price: "From $2.99"
        },
        {
            id: 10,
            image: "https://i5.walmartimages.com/dfw/4ff9c6c9-c327/k2-_92781d27-d929-4650-adb9-f0654ada1138.v1.jpg?odnHeight=290&odnWidth=290&odnBg=FFFFFF",
            title: "Toys & Games",
            description: "Fun for kids of all ages",
            price: "From $9.99"
        },
        {
            id: 11,
            image: "https://i5.walmartimages.com/dfw/4ff9c6c9-771e/k2-_b7107582-e998-4ca8-bc08-97d1c1395e8b.v1.jpg?odnHeight=290&odnWidth=290&odnBg=FFFFFF",
            title: "Tech & Gaming",
            description: "Latest gadgets and gaming gear",
            price: "From $29.99"
        },
        {
            id: 12,
            image: "https://i5.walmartimages.com/dfw/4ff9c6c9-5093/k2-_84cf0f36-6eef-40e5-a9cd-045f82f70d3e.v1.jpg?odnHeight=290&odnWidth=290&odnBg=FFFFFF",
            title: "Fashion Picks",
            description: "Stylish clothing and accessories",
            price: "From $19.99"
        }
    ],
    departments: [
        {
            id: 16,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS73g--k2FJdDcqf_eZ3g90kzOyEiafiJJe_w&s",
            name: "Television",
            badge: "Hot"
        },
        {
            id: 17,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUZY_XY3y-zPgmfdOoi2Sh6LbU8rbmh5c7hQ&s",
            name: "Refrigerator",
            badge: "New"
        },
        {
            id: 18,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbZWhdEyp4mWcIGOieM0GnXU0bS2_2OMrs4w&s",
            name: "Air Conditioner",
            badge: "Sale"
        },
        {
            id: 19,
            image: "https://i5.walmartimages.com/dfw/4ff9c6c9-e0ee/k2-_551b401e-73b8-49cc-a5cd-1fcbf0f8ecc8.v1.jpg?odnHeight=120px&odnWidth=120px&odnBg=FFFFFF",
            name: "Household Essentials"
        },
        {
            id: 20,
            image: "https://i5.walmartimages.com/dfw/4ff9c6c9-362d/k2-_fb442a82-c9c1-410d-b9d9-e9d5fc84ef2d.v1.jpg?odnHeight=120px&odnWidth=120px&odnBg=FFFFFF",
            name: "Home"
        },
        {
            id: 21,
            image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=120&h=120&fit=crop&crop=center",
            name: "Electronics",
            badge: "Trending"
        }
    ],
    rollbacks: [
        {
            id: 22,
            image: "https://i5.walmartimages.com/asr/d40772a4-e87d-4385-a712-b27f1b793697.e046de405bd3e603be4fe45ccce98d5a.jpeg?odnHeight=112&odnWidth=112&odnBg=FFFFFF",
            title: "Wireless Earbuds",
            description: "Premium sound with active noise cancellation",
            price: "$29.99",
            originalPrice: "$59.99",
            discount: "ROLLBACK",
            isRollback: true
        },
        {
            id: 23,
            image: "https://i5.walmartimages.com/asr/104b5bcf-e7da-497b-87f6-0a5a56249d27_1.5c18e44aae7893f3044b2aeeed360603.jpeg?odnHeight=112&odnWidth=112&odnBg=FFFFFF",
            title: "Smart Home Hub",
            description: "Control all your smart devices from one place",
            price: "$79.99",
            originalPrice: "$129.99",
            discount: "ROLLBACK",
            isRollback: true
        },
        {
            id: 24,
            image: "https://i5.walmartimages.com/asr/61e865fc-df33-4494-ad33-193740b366c5.6c2e4549ab3500f82d172aeb4149c7eb.jpeg?odnHeight=112&odnWidth=112&odnBg=FFFFFF",
            title: "Portable Charger",
            description: "Fast charging power bank with wireless capability",
            price: "$19.99",
            originalPrice: "$39.99",
            discount: "ROLLBACK",
            isRollback: true
        },
        {
            id: 25,
            image: "https://i5.walmartimages.com/asr/17187188-5b63-4c91-b9e8-e1d4ed8b1560.e39988e44f9ff3619ecddb8d746ee015.jpeg?odnHeight=112&odnWidth=112&odnBg=FFFFFF",
            title: "Bluetooth Keyboard",
            description: "Wireless mechanical keyboard for productivity",
            price: "$34.99",
            originalPrice: "$69.99",
            discount: "ROLLBACK",
            isRollback: true
        }
    ],
    values: [
        {
            id: 26,
            image: "https://i5.walmartimages.com/dfw/4ff9c6c9-cab4/k2-_ea6b8c8c-36da-4fda-95aa-0bf5bf984a81.v1.jpg?odnHeight=340&odnWidth=604&odnBg=FFFFFF",
            title: "Black & Unlimited",
            description: "For who you are & who you want to be, we're here to support your journey with inclusive products and services.",
            action: "Learn more",
            link: "#"
        },
        {
            id: 27,
            image: "https://i5.walmartimages.com/dfw/4ff9c6c9-f786/k2-_0749f48e-82aa-4d92-8ef2-946673f5f5f8.v1.jpg?odnHeight=340&odnWidth=604&odnBg=FFFFFF",
            title: "Built for Better",
            description: "Built for Better products with environmental certifications that help you make sustainable choices.",
            action: "Shop now",
            link: "#"
        },
        {
            id: 28,
            image: "https://i5.walmartimages.com/dfw/4ff9c6c9-e607/k2-_18ec31b5-ee4c-4a48-953a-f63433e511a9.v1.png?odnHeight=222&odnWidth=395&odnBg=FFFFFF",
            title: "Sustainable Living",
            description: "Products designed to help meet your needs & live by your values while protecting our planet.",
            action: "Explore",
            link: "#"
        }
    ]
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    showLoading();
    initializeSlider();
    loadAllSections();
    setupEventListeners();
    updateCartCount();
    hideLoading();
});

// Loading functions
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('show');
}

function hideLoading() {
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.remove('show');
    }, 1000);
}

// Slider functions
function initializeSlider() {
    showSlide(0);
    startAutoSlide();
}

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    if (n >= slides.length) currentSlide = 0;
    if (n < 0) currentSlide = slides.length - 1;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
    resetAutoSlide();
}

function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
    resetAutoSlide();
}

function currentSlideFunc(n) {
    currentSlide = n - 1;
    showSlide(currentSlide);
    resetAutoSlide();
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        currentSlide++;
        showSlide(currentSlide);
    }, 5000);
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// Product rendering function with hover-triggered carbon bar animation
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = products.map(product => {
        // Generate dynamic carbon score (20-80 range)
        const carbonScore = Math.floor(Math.random() * 61) + 20; // 20-80
        const carbonPercentage = ((80 - carbonScore) / 60) * 100; // Invert for better visual
        
        return `
            <div class="product-card" tabindex="0" role="button" aria-label="View ${product.title}" data-product-id="${product.id}" data-carbon-percentage="${carbonPercentage}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.title}" loading="lazy" class="product-image" />
                    ${product.discount ? `<div class="discount-badge">${product.discount}</div>` : ''}
                    <div class="image-overlay">
                        <div class="quick-actions">
                            <button class="quick-action-btn wishlist" title="Add to Wishlist" aria-label="Add to Wishlist">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="quick-action-btn share" title="Share" aria-label="Share">
                                <i class="fas fa-share-alt"></i>
                            </button>
                            <button class="quick-action-btn quick-view" title="Quick View" aria-label="Quick View">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="product-content">
                    <div class="product-header">
                        <h3 class="product-title">${product.title}</h3>
                        <div class="product-rating">
                            <div class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                            </div>
                            <span class="rating-count">(4.5)</span>
                        </div>
                    </div>
                    
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-badges">
                        <span class="badge quality"><i class="fas fa-check-circle"></i> Quality</span>
                        <span class="badge eco-friendly"><i class="fas fa-leaf"></i> Eco-Friendly</span>
                        <span class="badge best-seller"><i class="fas fa-fire"></i> Best Seller</span>
                    </div>
                    
                    <div class="eco-metrics">
                        <div class="carbon-footprint">
                            <div class="carbon-header">
                                <span class="carbon-label"><i class="fas fa-leaf"></i> Carbon Impact</span>
                                <span class="carbon-score">${carbonScore}kg CO₂</span>
                            </div>
                            <div class="carbon-bar-wrapper">
                                <div class="carbon-bar-track">
                                    <div class="carbon-bar-fill"></div>
                                    <div class="carbon-indicator"></div>
                                </div>
                            </div>
                            <div class="carbon-labels">
                                <span class="label-low">Low Impact</span>
                                <span class="label-high">High Impact</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="product-footer">
                        <div class="price-section">
                            <span class="current-price">${product.price}</span>
                            ${product.originalPrice ? `<span class="original-price">${product.originalPrice}</span>` : ''}
                        </div>
                        <button class="add-to-cart-btn" onclick="addToCart(${product.id}); event.stopPropagation();">
                            <span class="btn-text">Add to Cart</span>
                            <i class="fas fa-cart-plus btn-icon"></i>
                        </button>
                    </div>
                </div>
                
                <div class="product-glow"></div>
            </div>
        `;
    }).join('');

    // Setup hover listeners for carbon bar animation
    setupCarbonBarAnimations();
}

// Render departments function
function renderDepartments(departments, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = departments.map(dept => `
        <div class="department-item" onclick="navigateToDepartment('${dept.name.toLowerCase()}')" tabindex="0" role="button" aria-label="Shop ${dept.name}">
            <img src="${dept.image}" alt="${dept.name}" loading="lazy" />
            <p>${dept.name}</p>
            ${dept.badge ? `<div class="department-badge">${dept.badge}</div>` : ''}
        </div>
    `).join('');
}

// Enhanced renderProducts function for rollbacks
function renderRollbackProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = products.map(product => {
        const carbonScore = Math.floor(Math.random() * 61) + 20;
        const carbonPercentage = ((80 - carbonScore) / 60) * 100;
        
        return `
            <div class="product-card" tabindex="0" role="button" aria-label="View ${product.title}" data-product-id="${product.id}" data-carbon-percentage="${carbonPercentage}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.title}" loading="lazy" class="product-image" />
                    ${product.isRollback ? `<div class="rollback-badge">${product.discount}</div>` : ''}
                    <div class="image-overlay">
                        <div class="quick-actions">
                            <button class="quick-action-btn wishlist" title="Add to Wishlist" aria-label="Add to Wishlist">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="quick-action-btn share" title="Share" aria-label="Share">
                                <i class="fas fa-share-alt"></i>
                            </button>
                            <button class="quick-action-btn quick-view" title="Quick View" aria-label="Quick View">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="product-content">
                    <div class="product-header">
                        <h3 class="product-title">${product.title}</h3>
                        <div class="product-rating">
                            <div class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                            </div>
                            <span class="rating-count">(4.5)</span>
                        </div>
                    </div>
                    
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-badges">
                        <span class="badge quality"><i class="fas fa-check-circle"></i> Quality</span>
                        <span class="badge eco-friendly"><i class="fas fa-leaf"></i> Eco-Friendly</span>
                        <span class="badge best-seller"><i class="fas fa-fire"></i> Best Seller</span>
                    </div>
                    
                    <div class="eco-metrics">
                        <div class="carbon-footprint">
                            <div class="carbon-header">
                                <span class="carbon-label"><i class="fas fa-leaf"></i> Carbon Impact</span>
                                <span class="carbon-score">${carbonScore}kg CO₂</span>
                            </div>
                            <div class="carbon-bar-wrapper">
                                <div class="carbon-bar-track">
                                    <div class="carbon-bar-fill"></div>
                                    <div class="carbon-indicator"></div>
                                </div>
                            </div>
                            <div class="carbon-labels">
                                <span class="label-low">Low Impact</span>
                                <span class="label-high">High Impact</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="product-footer">
                        <div class="price-section">
                            <span class="current-price">${product.price}</span>
                            ${product.originalPrice ? `<span class="original-price">${product.originalPrice}</span>` : ''}
                        </div>
                        <button class="add-to-cart-btn" onclick="addToCart(${product.id}); event.stopPropagation();">
                            <span class="btn-text">Add to Cart</span>
                            <i class="fas fa-cart-plus btn-icon"></i>
                        </button>
                    </div>
                </div>
                
                <div class="product-glow"></div>
            </div>
        `;
    }).join('');

    setupCarbonBarAnimations();
}

// Render values function
function renderValues(values, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = values.map(value => `
        <div class="value-card" onclick="navigateToValue('${value.link}')" tabindex="0" role="button" aria-label="Learn about ${value.title}">
            <div class="value-card-image">
                <img src="${value.image}" alt="${value.title}" loading="lazy" />
            </div>
            <div class="value-card-content">
                <h3 class="value-card-title">${value.title}</h3>
                <p class="value-card-description">${value.description}</p>
                <a href="${value.link}" class="value-card-action">
                    ${value.action} <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join('');
}

// Setup carbon bar animations on hover
function setupCarbonBarAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const carbonBarFill = card.querySelector('.carbon-bar-fill');
        const carbonIndicator = card.querySelector('.carbon-indicator');
        const carbonPercentage = card.getAttribute('data-carbon-percentage');
        
        card.addEventListener('mouseenter', () => {
            // Animate carbon bar on hover
            carbonBarFill.style.width = carbonPercentage + '%';
            carbonIndicator.style.left = carbonPercentage + '%';
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset carbon bar when not hovering
            carbonBarFill.style.width = '0%';
            carbonIndicator.style.left = '0%';
        });
    });
}

// Load all sections - Updated to include new sections
function loadAllSections() {
    renderProducts(sampleProducts.continueShopping, 'continue-shopping');
    renderProducts(sampleProducts.spookySavings, 'spooky-savings');
    renderProducts(sampleProducts.continueShopping, 'cart-recommendations');
    renderProducts(sampleProducts.gifting, 'gifting-section');
    renderDepartments(sampleProducts.departments, 'departments');
    renderRollbackProducts(sampleProducts.rollbacks, 'rollbacks-section');
    renderValues(sampleProducts.values, 'values-section');
}

// Event listeners
function setupEventListeners() {
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
}

// Navigation functions
function navigateToDepartment(department) {
    localStorage.setItem("search_query", department);
    window.location.href = "tes2.html";
}

function navigateToValue(link) {
    if (link && link !== '#') {
        window.location.href = link;
    } else {
        showNotification('Coming soon!');
    }
}

// Product functions
function addToCart(productId) {
    // Search for product in all sections
    let product = null;
    
    // Check each section for the product
    for (const section in sampleProducts) {
        if (Array.isArray(sampleProducts[section])) {
            product = sampleProducts[section].find(p => p.id === productId);
            if (product) break;
        }
    }
    
    if (!product) {
        console.error('Product not found:', productId);
        showNotification('Product not found!', 'error');
        return;
    }

    // Get current cart from localStorage or initialize new cart
    let cart = JSON.parse(localStorage.getItem('walmartCart')) || [];
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.count += 1;
    } else {
        cart.push({
            ...product,
            count: 1
        });
    }
    
    // Save updated cart
    localStorage.setItem('walmartCart', JSON.stringify(cart));
    
    // Update cart count in navbar
    updateCartCount();
    
    // Show success notification with product name
    showNotification(`${product.title} added to cart!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('walmartCart')) || [];
    const totalItems = cart.reduce((total, item) => total + (item.count || 0), 0);
    
    // Update the cart badge in the navbar
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    return totalItems;
}

// Green Mode Functions
function toggleGreenMode() {
    const toggle = document.getElementById('greenModeToggle');
    const status = document.getElementById('toggleStatus');
    const greenModeSection = document.getElementById('greenModeSection');
    const isActive = toggle.classList.contains('active');

    if (isActive) {
        toggle.classList.remove('active');
        status.classList.remove('active');
        status.textContent = 'Inactive';
        greenModeSection.classList.remove('active');
        // Deactivate all options
        document.querySelectorAll('.eco-option-card').forEach(card => {
            card.classList.remove('active');
            const badge = card.querySelector('.option-badge');
            if (badge) badge.style.opacity = '0';
        });
    } else {
        toggle.classList.add('active');
        status.classList.add('active');
        status.textContent = 'Active';
        greenModeSection.classList.add('active');
        // Activate all options
        document.querySelectorAll('.eco-option-card').forEach(card => {
            card.classList.add('active');
            const badge = card.querySelector('.option-badge');
            if (badge) badge.style.opacity = '1';
        });
    }
}

function toggleOption(cardElement, optionName) {
    if (!cardElement) return;
    const isActive = cardElement.classList.contains('active');
    if (isActive) {
        cardElement.classList.remove('active');
        const badge = cardElement.querySelector('.option-badge');
        if (badge) badge.style.opacity = '0';
    } else {
        cardElement.classList.add('active');
        const badge = cardElement.querySelector('.option-badge');
        if (badge) badge.style.opacity = '1';
    }
}

// Notification function
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--walmart-blue);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-medium);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Search function (if you have a search input)
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        const query = searchInput.value;
        
        if (query) {
            localStorage.setItem("search_query", query);
            window.location.href = "tes2.html";
        }
    }
}

// Wishlist functions
function addToWishlist(productId) {
    // Get current wishlist from localStorage or initialize new wishlist
    let wishlist = JSON.parse(localStorage.getItem('walmartWishlist')) || [];
    
    // Search for product in all sections
    let product = null;
    for (const section in sampleProducts) {
        if (Array.isArray(sampleProducts[section])) {
            product = sampleProducts[section].find(p => p.id === productId);
            if (product) break;
        }
    }
    
    if (!product) {
        showNotification('Product not found!');
        return;
    }
    
    // Check if product already exists in wishlist
    const existingItem = wishlist.find(item => item.id === productId);
    
    if (existingItem) {
        showNotification('Product already in wishlist!');
        return;
    }
    
    // Add to wishlist
    wishlist.push(product);
    localStorage.setItem('walmartWishlist', JSON.stringify(wishlist));
    
    showNotification(`${product.title} added to wishlist!`);
}

// Share function
function shareProduct(productId) {
    // Search for product in all sections
    let product = null;
    for (const section in sampleProducts) {
        if (Array.isArray(sampleProducts[section])) {
            product = sampleProducts[section].find(p => p.id === productId);
            if (product) break;
        }
    }
    
    if (!product) {
        showNotification('Product not found!');
        return;
    }
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: product.title,
            text: product.description,
            url: window.location.href
        }).then(() => {
            showNotification('Product shared successfully!');
        }).catch((error) => {
            console.log('Error sharing:', error);
            fallbackShare(product);
        });
    } else {
        fallbackShare(product);
    }
}

// Fallback share function
function fallbackShare(product) {
    // Copy to clipboard
    const shareText = `Check out this product: ${product.title} - ${product.price}\n${window.location.href}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Product link copied to clipboard!');
        }).catch(() => {
            showNotification('Unable to share product');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Product link copied to clipboard!');
        } catch (err) {
            showNotification('Unable to share product');
        }
        document.body.removeChild(textArea);
    }
}

// Quick view function
function quickViewProduct(productId) {
    // Search for product in all sections
    let product = null;
    for (const section in sampleProducts) {
        if (Array.isArray(sampleProducts[section])) {
            product = sampleProducts[section].find(p => p.id === productId);
            if (product) break;
        }
    }
    
    if (!product) {
        showNotification('Product not found!');
        return;
    }
    
    // Create and show quick view modal
    createQuickViewModal(product);
}

// Create quick view modal
function createQuickViewModal(product) {
    // Remove existing modal if any
    const existingModal = document.getElementById('quickViewModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'quickViewModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content quick-view-content">
            <span class="close" onclick="closeQuickView()">&times;</span>
            <div class="quick-view-body">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.title}" />
                </div>
                <div class="quick-view-details">
                    <h2>${product.title}</h2>
                    <div class="quick-view-rating">
                        <div class="stars">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half-alt"></i>
                        </div>
                        <span>(4.5 stars, 1,234 reviews)</span>
                    </div>
                    <p class="quick-view-description">${product.description}</p>
                    <div class="quick-view-price">
                        <span class="current-price">${product.price}</span>
                        ${product.originalPrice ? `<span class="original-price">${product.originalPrice}</span>` : ''}
                    </div>
                    <div class="quick-view-actions">
                        <button class="add-to-cart-btn" onclick="addToCart(${product.id}); closeQuickView();">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="wishlist-btn" onclick="addToWishlist(${product.id});">
                            <i class="fas fa-heart"></i> Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeQuickView();
        }
    });
}

// Close quick view modal
function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Enhanced event listeners for product interactions
function setupProductInteractions() {
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        
        const action = target.getAttribute('data-action');
        const productId = parseInt(target.closest('.product-card').getAttribute('data-product-id'));
        
        switch (action) {
            case 'wishlist':
                addToWishlist(productId);
                break;
            case 'share':
                shareProduct(productId);
                break;
            case 'quick-view':
                quickViewProduct(productId);
                break;
        }
    });
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Utility function to generate random ratings
function generateRandomRating() {
    const ratings = [4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0];
    return ratings[Math.floor(Math.random() * ratings.length)];
}

// Utility function to generate random review count
function generateRandomReviewCount() {
    return Math.floor(Math.random() * 5000) + 100;
}

// Enhanced product card click handler
function handleProductCardClick(productId) {
    // Navigate to product detail page
    localStorage.setItem('selectedProductId', productId);
    // window.location.href = `product-detail.html?id=${productId}`;
    showNotification('Product details coming soon!');
}

// Global function assignments for onclick handlers
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.currentSlide = currentSlideFunc;
window.addToCart = addToCart;
window.toggleGreenMode = toggleGreenMode;
window.toggleOption = toggleOption;
window.navigateToDepartment = navigateToDepartment;
window.navigateToValue = navigateToValue;
window.performSearch = performSearch;
window.addToWishlist = addToWishlist;
window.shareProduct = shareProduct;
window.quickViewProduct = quickViewProduct;
window.closeQuickView = closeQuickView;
window.handleProductCardClick = handleProductCardClick;

// Performance optimization with Intersection Observer
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    // Observe all lazy loading images
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Error handling for images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
    }
}, true);

// Keyboard accessibility enhancements
document.addEventListener('keydown', (e) => {
    // Handle Enter key on focusable elements
    if (e.key === 'Enter') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('product-card')) {
            const productId = parseInt(focusedElement.getAttribute('data-product-id'));
            handleProductCardClick(productId);
        } else if (focusedElement.classList.contains('department-item')) {
            focusedElement.click();
        } else if (focusedElement.classList.contains('value-card')) {
            focusedElement.click();
        }
    }
    
    // Handle Escape key to close modals
    if (e.key === 'Escape') {
        closeQuickView();
    }
});

// Touch/swipe support for mobile slider
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            nextSlide();
        } else {
            // Swipe right - previous slide
            prevSlide();
        }
    }
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, eventData);
    
    // Example: Google Analytics 4
    // gtag('event', eventName, eventData);
    
    // Example: Custom analytics
    // analytics.track(eventName, eventData);
}

// Track product interactions
function trackProductInteraction(action, productId) {
    trackEvent('product_interaction', {
        action: action,
        product_id: productId,
        timestamp: new Date().toISOString()
    });
}

// Initialize analytics tracking
function initializeAnalytics() {
    // Track page view
    trackEvent('page_view', {
        page: 'home',
        timestamp: new Date().toISOString()
    });
}

// Call analytics initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeAnalytics();
});

// Cleanup function for when page is unloaded
window.addEventListener('beforeunload', () => {
    // Clear any intervals
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    
    // Save any pending data
    // This is a good place to save user preferences, cart state, etc.
});

// Debug mode (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugMode = true;
    window.sampleProducts = sampleProducts; // Expose for debugging
    console.log('Debug mode enabled. Access sampleProducts via window.sampleProducts');
}