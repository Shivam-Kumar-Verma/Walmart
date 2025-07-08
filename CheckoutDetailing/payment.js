// Global variables
let cartValue = JSON.parse(localStorage.getItem("walmartCart")) || [];
let selectedPaymentMethod = 'card';
let isProcessing = false;
let orderSummary = JSON.parse(localStorage.getItem('orderSummary')) || {};

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    displayCartItems();
    calculateTotals();
    setupFormValidation();
    setupEcoFeatures(); // Initialize eco features
});

// Initialize page functionality
function initializePage() {
    // Focus first input for accessibility
    const firstInput = document.querySelector('input');
    if (firstInput) {
        firstInput.focus();
    }

    // Set up payment method selection
    setupPaymentMethods();
    
    // Format card number input
    setupCardNumberFormatting();
    
    // Setup phone number formatting
    setupPhoneNumberFormatting();
    
    // Load saved form data if available
    loadSavedFormData();
}

// Setup event listeners
function setupEventListeners() {
    // Checkout button
    const checkoutBtn = document.getElementById('buttonContinue');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
    
    // Eco delivery option
    const ecoDelivery = document.getElementById('eco');
    if (ecoDelivery) {
        ecoDelivery.addEventListener('change', updateEcoPoints);
    }
    
    // Tree donation option
    const treeDonation = document.getElementById('treeDonation');
    if (treeDonation) {
        treeDonation.addEventListener('change', updateEcoPoints);
    }

    // Close savings banner
    const closeSavingsBtn = document.querySelector('.close-savings');
    if (closeSavingsBtn) {
        closeSavingsBtn.addEventListener('click', closeSavingsBanner);
    }

    // Form inputs for real-time validation
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        input.addEventListener('input', clearFieldError);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Display cart items
function displayCartItems() {
    const cartDetailsContainer = document.getElementById('cartDetails');
    const orderItemsContainer = document.getElementById('order-items');
    
    if (!cartDetailsContainer || !orderItemsContainer) return;

    cartDetailsContainer.innerHTML = '';
    orderItemsContainer.innerHTML = '';

    if (cartValue.length === 0) {
        cartDetailsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="../index.html" class="btn-primary">Continue Shopping</a>
            </div>
        `;
        document.getElementById('checkout-form').style.display = 'none';
        return;
    }

    let subtotal = 0;
    
    cartValue.forEach((item, index) => {
        const price = item.price ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) : 
                     (item.Sale_Price ? parseFloat(item.Sale_Price.replace(/[^0-9.-]+/g, '')) : 0);
        const itemTotal = price * (item.count || 1);
        subtotal += itemTotal;

        // Cart item for details
        const cartItem = createCartItemElement(item, index, itemTotal);
        cartDetailsContainer.appendChild(cartItem);
        
        // Order item for summary
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <span class="item-name">${item.title || item.Product_Name || 'Product'} x${item.count || 1}</span>
            <span class="item-price">$${itemTotal.toFixed(2)}</span>
        `;
        orderItemsContainer.appendChild(orderItem);
    });

    // Calculate totals
    const shipping = subtotal >= 35 ? 0 : 6.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    // Update order summary
    orderSummary = {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        itemCount: cartValue.reduce((acc, item) => acc + (item.count || 1), 0)
    };
    
    // Save to localStorage for order summary
    localStorage.setItem('orderSummary', JSON.stringify(orderSummary));

    // Safely update UI elements if they exist
    const updateIfExists = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    updateIfExists('totalItems', orderSummary.itemCount);
    updateIfExists('subtotal-amount', `$${orderSummary.subtotal}`);
    updateIfExists('shipping-amount', orderSummary.shipping === '0.00' ? 'FREE' : `$${orderSummary.shipping}`);
    updateIfExists('tax-amount', `$${orderSummary.tax}`);
    updateIfExists('estimatedTotal', `$${orderSummary.total}`);
}

// Create cart item element
function createCartItemElement(item, index, itemTotal) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    const price = item.price ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) : 
                 (item.Sale_Price ? parseFloat(item.Sale_Price.replace(/[^0-9.-]+/g, '')) : 0);
    
    div.innerHTML = `
        <div class="flex items-center space-x-4">
            <img src="${item.image || item.Product_imgUrl || 'https://via.placeholder.com/80x80'}" 
                 alt="${item.title || item.Product_Name || 'Product'}" 
                 class="w-20 h-20 object-cover rounded"
                 onerror="this.src='https://via.placeholder.com/80x80'">
            <div class="flex-1">
                <h4 class="font-medium text-gray-900">${item.title || item.Product_Name || 'Product Name'}</h4>
                <p class="text-sm text-gray-500">${item.brand || ''}</p>
                <div class="flex items-center mt-1">
                    <span class="text-sm text-gray-600">Qty: ${item.count || 1}</span>
                    <span class="mx-2 text-gray-300">|</span>
                    <span class="text-sm font-medium">$${price.toFixed(2)} each</span>
                </div>
            </div>
            <div class="font-medium">$${itemTotal.toFixed(2)}</div>
        </div>
    `;
    return div;
}

// Calculate totals
function calculateTotals() {
    const subtotal = cartValue.reduce((sum, item) => {
        const price = item.price ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) : 0;
        return sum + (price * (item.count || 1));
    }, 0);
    
    // Check for eco delivery discount
    const ecoDelivery = document.getElementById('eco');
    const isEcoDelivery = ecoDelivery && ecoDelivery.checked;
    
    // Check for tree donation
    const treeDonation = document.getElementById('treeDonation');
    const hasTreeDonation = treeDonation && treeDonation.checked;
    
    // Check for combine orders
    const batchDelivery = document.getElementById('batchDelivery');
    const hasBatchDelivery = batchDelivery && batchDelivery.checked;

    // Calculate shipping (free for orders over $35, eco delivery is free)
    let shipping = subtotal >= 35 || isEcoDelivery ? 0 : 5.99;
    
    // Add donation amount if selected
    const donationAmount = hasTreeDonation ? 1 : 0;
    
    // Apply eco delivery discount
    const ecoDiscount = isEcoDelivery ? 1 : 0;
    
    // Calculate tax (10% on subtotal after eco discount, before donation)
    const discountedSubtotal = Math.max(0, subtotal - ecoDiscount);
    const tax = (discountedSubtotal) * 0.1; // 10% tax on items after discount
    
    // Calculate final total (subtotal - discount + shipping + tax + donation)
    const finalTotal = discountedSubtotal + shipping + tax + donationAmount;
    
    // Debug log to verify calculations
    console.log({
        subtotal,
        ecoDiscount,
        discountedSubtotal,
        shipping,
        tax,
        donationAmount,
        finalTotal
    });
    
    // Update order summary
    orderSummary = {
        subtotal: subtotal.toFixed(2), // Show original subtotal before any discounts
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: finalTotal.toFixed(2),
        itemCount: cartValue.reduce((acc, item) => acc + (item.count || 1), 0),
        isEcoDelivery,
        hasTreeDonation,
        donationAmount: donationAmount.toFixed(2),
        hasBatchDelivery,
        ecoDiscount: ecoDiscount.toFixed(2),
        originalSubtotal: subtotal.toFixed(2) // Keep track of original subtotal
    };
    
    // Save to localStorage for order summary
    localStorage.setItem('orderSummary', JSON.stringify(orderSummary));
    
    // Update UI with proper number formatting and ensure 2 decimal places
    const formatCurrency = (amount) => {
        return `$${parseFloat(amount).toFixed(2)}`;
    };
    
    updateTotalDisplay('subtotal-amount', formatCurrency(orderSummary.subtotal));
    updateTotalDisplay('shipping-amount', orderSummary.shipping === '0.00' ? 'FREE' : formatCurrency(orderSummary.shipping));
    updateTotalDisplay('tax-amount', formatCurrency(orderSummary.tax));
    updateTotalDisplay('estimated-total', formatCurrency(orderSummary.total));
    
    // Add or update eco discount line
    if (isEcoDelivery) {
        let ecoDiscountLine = document.getElementById('eco-discount-line');
        if (!ecoDiscountLine) {
            const orderSummary = document.querySelector('.order-summary-row');
            if (orderSummary) {
                const shippingRow = document.querySelector('.order-summary-row.savings-row');
                if (shippingRow) {
                    ecoDiscountLine = document.createElement('div');
                    ecoDiscountLine.className = 'order-summary-row eco-discount';
                    ecoDiscountLine.id = 'eco-discount-line';
                    ecoDiscountLine.innerHTML = `
                        <span class="summary-label">Eco Delivery Discount</span>
                        <span class="summary-value eco-text">-$${ecoDiscount.toFixed(2)}</span>
                    `;
                    shippingRow.after(ecoDiscountLine);
                }
            }
        } else {
            ecoDiscountLine.querySelector('.summary-value').textContent = `-$${ecoDiscount.toFixed(2)}`;
        }
    } else {
        const ecoDiscountLine = document.getElementById('eco-discount-line');
        if (ecoDiscountLine) {
            ecoDiscountLine.remove();
        }
    }
    
    // Add or update tree donation line if applicable
    if (hasTreeDonation) {
        let donationLine = document.getElementById('donation-line');
        if (!donationLine) {
            const orderSummary = document.querySelector('.order-summary-row');
            if (orderSummary) {
                const ecoLine = document.getElementById('eco-discount-line') || 
                              document.querySelector('.order-summary-row.savings-row');
                if (ecoLine) {
                    donationLine = document.createElement('div');
                    donationLine.className = 'order-summary-row';
                    donationLine.id = 'donation-line';
                    donationLine.innerHTML = `
                        <span class="summary-label">Tree Donation</span>
                        <span class="summary-value eco-donation">+$${donationAmount.toFixed(2)}</span>
                    `;
                    ecoLine.after(donationLine);
                }
            }
        } else {
            donationLine.querySelector('.summary-value').textContent = `+$${donationAmount.toFixed(2)}`;
        }
    } else {
        const donationLine = document.getElementById('donation-line');
        if (donationLine) {
            donationLine.remove();
        }
    }
    

    
    updateTotalDisplay('estimatedTotal', `$${orderSummary.total}`);
    
    // Update EcoPoints
    updateEcoPoints();
}

// Update total display
function updateTotalDisplay(elementId, amount) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = typeof amount === 'string' ? amount : `$${amount.toFixed(2)}`;
    }
}

// Setup eco features
function setupEcoFeatures() {
    // Initialize event listeners for eco options
    const ecoDelivery = document.getElementById('eco');
    const treeDonation = document.getElementById('treeDonation');
    const batchDelivery = document.getElementById('batchDelivery'); 
    
    if (ecoDelivery) {
        ecoDelivery.addEventListener('change', calculateTotals);
    }
    
    if (treeDonation) {
        treeDonation.addEventListener('change', calculateTotals);
    }
    if (batchDelivery) {
        batchDelivery.addEventListener('change', calculateTotals);
    }
    
    // Initialize EcoPoints display
    updateEcoPoints();
}

// Update EcoPoints display
function updateEcoPoints() {
    const ecoDelivery = document.getElementById('eco');
    const treeDonation = document.getElementById('treeDonation');
    const batchDelivery = document.getElementById('batchDelivery');
    
    // Only add EcoPoints if Eco-Delivery is selected
    const ecoDeliveryPoints = ecoDelivery && ecoDelivery.checked ? 50 : 0;
    const donationPoints = treeDonation && treeDonation.checked ? 30 : 0;
    const batchPoints = batchDelivery && batchDelivery.checked ? 25 : 0;
    
    const totalPoints = ecoDeliveryPoints + donationPoints + batchPoints;

    // Update points display
    const ecoDeliveryEl = document.getElementById('ecodelivery-points');
    const donationEl = document.getElementById('donation-points');
    const batchEl = document.getElementById('batch-points');
    const totalEl = document.getElementById('total-ecopoints');
    
    if (ecoDeliveryEl) ecoDeliveryEl.textContent = `+${ecoDeliveryPoints}`;
    if (donationEl) donationEl.textContent = `+${donationPoints}`;
    if (batchEl) batchEl.textContent = `+${batchPoints}`;
    if (totalEl) totalEl.textContent = `${totalPoints} EcoPoints`;
    
    // Show/hide points rows based on selection
    const ecoRow = document.querySelector('.ecopoints-row:nth-child(1)');
    const donationRow = document.querySelector('.ecopoints-row:nth-child(2)');
    const batchRow = document.getElementById('batch-row');
    
    if (ecoRow) ecoRow.style.display = ecoDeliveryPoints > 0 ? 'flex' : 'none';
    if (donationRow) donationRow.style.display = donationPoints > 0 ? 'flex' : 'none';
    if (batchRow) batchRow.style.display = batchPoints > 0 ? 'flex' : 'none';
    
    // Show notification for points earned
    if (ecoDelivery && ecoDelivery.checked) {
        showNotification('You\'ve selected Eco-Delivery and earned 50 EcoPoints!', 'success');
    } 
    if (treeDonation && treeDonation.checked) {
        showNotification('Thank you for your donation! You\'ve earned 30 EcoPoints!', 'success');
    } 
    if (batchDelivery && batchDelivery.checked) {
        showNotification('Thank you for combining orders! You\'ve earned 25 EcoPoints!', 'success');
    }
}

// Add event listeners for delivery options
document.addEventListener('DOMContentLoaded', function() {
    const deliveryOptions = document.querySelectorAll('input[name="deliveryOption"]');
    deliveryOptions.forEach(option => {
        option.addEventListener('change', function() {
            // If standard delivery is selected, ensure EcoPoints are updated
            if (this.id === 'standard' && this.checked) {
                updateEcoPoints();
            }
        });
    });
});

// Setup payment methods
function setupPaymentMethods() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                selectedPaymentMethod = radio.value;
                updatePaymentForm();
            }
        });
    });
}

// Update payment form based on selected method
function updatePaymentForm() {
    const cardForm = document.getElementById('cardForm');
    if (!cardForm) return;

    switch (selectedPaymentMethod) {
        case 'card':
            cardForm.style.display = 'block';
            break;
        case 'paypal':
            cardForm.style.display = 'none';
            break;
        case 'gift':
            cardForm.style.display = 'none';
            break;
        default:
            cardForm.style.display = 'block';
    }
}

// Setup card number formatting
function setupCardNumberFormatting() {
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (formattedValue !== e.target.value) {
                e.target.value = formattedValue;
            }
        });

        // Expiry date formatting
        const expiryInput = document.getElementById('expiryDate');
        if (expiryInput) {
            expiryInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }

        // CVV formatting
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', function(e) {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }
    }
}

// Setup phone number formatting
function setupPhoneNumberFormatting() {
    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6, 10)}`;
            } else if (value.length >= 3) {
                value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
            }
            e.target.value = value;
        });
    }
}

// Form validation
function setupFormValidation() {
    const form = document.querySelector('form') || document.body;
    
    // Real-time validation
    const requiredInputs = document.querySelectorAll('input[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function validateField(field) {
    // Return true if field is undefined or null
    if (!field) return true;
    
    const value = field.value ? field.value.trim() : '';
    const fieldType = field.type || '';
    const fieldId = field.id || '';
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Validate based on field type
    switch (fieldId) {
        case 'cardNumber':
            if (selectedPaymentMethod === 'card' && (!value || value.replace(/\s/g, '').length < 13)) {
                showFieldError(field, 'Please enter a valid card number');
                return false;
            }
            break;
        case 'expiryDate':
            if (selectedPaymentMethod === 'card' && (!value || !isValidExpiryDate(value))) {
                showFieldError(field, 'Please enter a valid expiry date (MM/YY)');
                return false;
            }
            break;
        case 'cvv':
            if (selectedPaymentMethod === 'card' && (!value || value.length < 3)) {
                showFieldError(field, 'Please enter a valid CVV');
                return false;
            }
            break;
        case 'cardName':
            if (selectedPaymentMethod === 'card' && (!value || value.length < 2)) {
                showFieldError(field, 'Please enter the name on the card');
                return false;
            }
            break;
        case 'phoneNumber':
            if (!value || !isValidPhoneNumber(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
            break;
        default:
            if (field.hasAttribute('required') && !value) {
                showFieldError(field, 'This field is required');
                return false;
            }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--error-color);
        font-size: 0.85rem;
        margin-top: 0.25rem;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Validation helper functions
function isValidExpiryDate(date) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(date)) return false;
    
    const [month, year] = date.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();
    
    return expiry > now;
}

function isValidPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
}

// Handle checkout process
async function handleCheckout() {
    if (isProcessing) return;
    
    // Validate form
    if (!validateCheckoutForm()) {
        return;
    }
    
    isProcessing = true;
    showLoadingOverlay();
    
    try {
        // Simulate payment processing
        await processPayment();
        
        // Show success modal
        showSuccessModal();
        
    } catch (error) {
        console.error('Checkout error:', error);
        showNotification('Payment failed. Please try again.', 'error');
    } finally {
        isProcessing = false;
        hideLoadingOverlay();
    }
}

function validateCheckoutForm() {
    const requiredFields = document.querySelectorAll('input[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly.', 'error');
        // Focus first invalid field
        const firstError = document.querySelector('input.error');
        if (firstError) {
            firstError.focus();
        }
    }
    
    return isValid;
}

async function processPayment() {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
        // In a real application, you would:
        // 1. Send payment data to your backend
        // 2. Process payment with payment gateway
        // 3. Handle response and errors
        
        // For demo, we'll just simulate success
        const orderNumber = generateOrderNumber();
        
        // Save order to order history
        const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        const order = {
            id: orderNumber,
            date: new Date().toISOString(),
            items: [...cartValue],
            total: orderSummary.total,
            status: 'Processing'
        };
        orders.unshift(order);
        localStorage.setItem('orderHistory', JSON.stringify(orders));
        
        // Clear cart after successful payment
        localStorage.removeItem('walmartCart');
        
        return { success: true, orderNumber };
    } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
    }
}

function generateOrderNumber() {
    return 'WM' + Date.now().toString().slice(-8);
}

// UI Helper Functions
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    const orderNumber = document.getElementById('orderNumber');
    
    if (modal && orderNumber) {
        orderNumber.textContent = generateOrderNumber();
        modal.classList.add('show');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

function closeSavingsBanner() {
    const banner = document.getElementById('savingsBanner');
    if (banner) {
        banner.style.display = 'none';
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon ${getNotificationIcon(type)}"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        z-index: 10000;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Navigation functions
function editAddress() {
    showNotification('Address editing would be implemented here.', 'info');
}

function addInstructions() {
    showNotification('Delivery instructions form would open here.', 'info');
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    updatePaymentForm();
    
    // Update radio button
    const radio = document.querySelector(`input[value="${method}"]`);
    if (radio) {
        radio.checked = true;
    }
}

function goToOrderConfirmation() {
    window.location.href = 'orderConfirm.html';
}

// Keyboard shortcuts (continued)
function handleKeyboardShortcuts(e) {
    // ESC key closes modals
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal.show');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Ctrl/Cmd + Enter submits form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleCheckout();
    }
}

// Save and load form data
function saveFormData() {
    const formData = {
        cardNumber: document.getElementById('cardNumber')?.value || '',
        cardName: document.getElementById('cardName')?.value || '',
        phoneNumber: document.getElementById('phoneNumber')?.value || '',
        smsUpdates: document.getElementById('smsUpdates')?.checked || false,
        paymentMethod: selectedPaymentMethod
    };
    
    // Don't save sensitive data like CVV and expiry
    localStorage.setItem('checkout_form_data', JSON.stringify(formData));
}

function loadSavedFormData() {
    const savedData = localStorage.getItem('checkout_form_data');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            // Load non-sensitive data only
            if (data.cardName) {
                const cardNameInput = document.getElementById('cardName');
                if (cardNameInput) cardNameInput.value = data.cardName;
            }
            
            if (data.phoneNumber) {
                const phoneInput = document.getElementById('phoneNumber');
                if (phoneInput) phoneInput.value = data.phoneNumber;
            }
            
            if (data.smsUpdates !== undefined) {
                const smsCheckbox = document.getElementById('smsUpdates');
                if (smsCheckbox) smsCheckbox.checked = data.smsUpdates;
            }
            
            if (data.paymentMethod) {
                selectedPaymentMethod = data.paymentMethod;
                const paymentRadio = document.querySelector(`input[value="${data.paymentMethod}"]`);
                if (paymentRadio) {
                    paymentRadio.checked = true;
                    updatePaymentForm();
                }
            }
        } catch (error) {
            console.error('Error loading saved form data:', error);
        }
    }
}

// Auto-save form data (debounced)
let saveTimeout;
function autoSaveFormData() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveFormData, 1000);
}

// Add auto-save listeners
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('input', autoSaveFormData);
        input.addEventListener('change', autoSaveFormData);
    });
});

// Analytics and tracking
function trackCheckoutEvent(eventName, properties = {}) {
    console.log('Checkout event:', eventName, properties);
    // In production, send to analytics service
    // analytics.track(eventName, properties);
}

// Track form interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track payment method selection
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', () => {
            const method = option.querySelector('input').value;
            trackCheckoutEvent('payment_method_selected', { method });
        });
    });
    
    // Track form field interactions
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', () => {
            trackCheckoutEvent('form_field_focused', { field: input.id });
        });
    });
    
    // Track checkout attempts
    const checkoutBtn = document.getElementById('buttonContinue');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            trackCheckoutEvent('checkout_attempted', {
                cart_value: cartValue.length,
                payment_method: selectedPaymentMethod
            });
        });
    }
});

// Error handling and recovery
window.addEventListener('error', function(e) {
    console.error('Checkout page error:', e.error);
    showNotification('An unexpected error occurred. Please refresh the page and try again.', 'error');
    trackCheckoutEvent('error_occurred', { error: e.error.message });
});

// Handle network errors
window.addEventListener('online', function() {
    showNotification('Connection restored.', 'success');
});

window.addEventListener('offline', function() {
    showNotification('You are currently offline. Please check your connection.', 'warning');
});

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Checkout page loaded in ${loadTime.toFixed(2)}ms`);
    trackCheckoutEvent('page_loaded', { loadTime: Math.round(loadTime) });
});

// Accessibility improvements
function setupAccessibility() {
    // Add ARIA live region for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(liveRegion);
    
    // Announce important changes to screen readers
    window.announceToScreenReader = function(message) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    };
    
    // Improve form labels association
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label && !input.getAttribute('aria-describedby')) {
            input.setAttribute('aria-describedby', `${input.id}-help`);
        }
    });
    
    // Add keyboard navigation for custom elements
    const customButtons = document.querySelectorAll('.payment-option');
    customButtons.forEach(button => {
        button.setAttribute('tabindex', '0');
        button.setAttribute('role', 'button');
        
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', setupAccessibility);

// Security enhancements
function setupSecurity() {
    // Clear sensitive data on page unload
    window.addEventListener('beforeunload', function() {
        const sensitiveFields = ['cardNumber', 'cvv', 'expiryDate'];
        sensitiveFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = '';
            }
        });
    });
    
    // Prevent right-click on sensitive areas (optional)
    const sensitiveAreas = document.querySelectorAll('.card-form');
    sensitiveAreas.forEach(area => {
        area.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    });
    
    // Add input masking for security
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('blur', function() {
            // Mask all but last 4 digits when field loses focus
            const value = this.value.replace(/\s/g, '');
            if (value.length > 4) {
                const masked = '*'.repeat(value.length - 4) + value.slice(-4);
                this.dataset.masked = 'true';
                this.dataset.originalValue = value;
                this.value = masked.match(/.{1,4}/g)?.join(' ') || masked;
            }
        });
        
        cardNumberInput.addEventListener('focus', function() {
            // Restore original value when field gains focus
            if (this.dataset.masked === 'true') {
                const original = this.dataset.originalValue;
                this.value = original.match(/.{1,4}/g)?.join(' ') || original;
                this.dataset.masked = 'false';
            }
        });
    }
}

// Initialize security features
document.addEventListener('DOMContentLoaded', setupSecurity);

// Mobile-specific enhancements
function setupMobileEnhancements() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Add mobile-specific classes
        document.body.classList.add('mobile-device');
        
        // Prevent zoom on input focus for iOS
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                }
            });
            
            input.addEventListener('blur', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
                }
            });
        });
        
        // Add haptic feedback for buttons (if supported)
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            });
        });
        
        // Optimize touch interactions
        const touchElements = document.querySelectorAll('.payment-option, .checkout-btn');
        touchElements.forEach(element => {
            element.style.minHeight = '44px'; // Minimum touch target size
        });
    }
}

// Initialize mobile enhancements
document.addEventListener('DOMContentLoaded', setupMobileEnhancements);

// Progressive Web App features
function setupPWAFeatures() {
    // Service worker registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed');
                });
        });
    }
    
    // Add to home screen prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button (optional)
        const installBtn = document.createElement('button');
        installBtn.textContent = 'Install App';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--walmart-blue);
            color: white;
            border: none;
            padding: 0.75rem 1rem;
            border-radius: 25px;
            cursor: pointer;
            z-index: 1000;
        `;
        
        installBtn.onclick = async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to install prompt: ${outcome}`);
                deferredPrompt = null;
                installBtn.remove();
            }
        };
        
        document.body.appendChild(installBtn);
    });
}

// Initialize PWA features
setupPWAFeatures();

// Export functions for testing (in development)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        displayCartItems,
        calculateTotals,
        validateField,
        handleCheckout,
        processPayment
    };
}

// Development helpers
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    // Add development-only features
    console.log('Checkout page loaded in development mode');
    
    // Add test data button for quick testing
    const testDataBtn = document.createElement('button');
    testDataBtn.textContent = 'Fill Test Data';
    testDataBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: var(--walmart-orange);
        color: white;
        border: none;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        cursor: pointer;
        z-index: 10000;
    `;
    testDataBtn.onclick = () => {
        document.getElementById('cardNumber').value = '4111 1111 1111 1111';
        document.getElementById('expiryDate').value = '12/25';
        document.getElementById('cvv').value = '123';
        document.getElementById('cardName').value = 'John Doe';
        document.getElementById('phoneNumber').value = '(555) 123-4567';
    };
    document.body.appendChild(testDataBtn);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced Walmart checkout page initialized');
    
    // Track page view
    trackCheckoutEvent('checkout_page_viewed', {
        cart_items: cartValue.length,
        timestamp: new Date().toISOString()
    });
});
