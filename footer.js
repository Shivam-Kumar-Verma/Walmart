// Global variables
let selectedRating = 0;
let selectedTimeSlot = null;

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const firstFocusable = modal.querySelector('button, input, textarea, select, a[href]');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
        
        // Track modal opening
        trackFooterInteraction('modal_opened', { modal_id: modalId });
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset form states
        if (modalId === 'feedbackModal') {
            resetFeedbackForm();
        } else if (modalId === 'reserveModal') {
            resetReservationForm();
        }
        
        // Track modal closing
        trackFooterInteraction('modal_closed', { modal_id: modalId });
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        const modalId = event.target.id;
        closeModal(modalId);
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="flex"]');
        if (openModal) {
            closeModal(openModal.id);
        }
    }
});

// Feedback functionality
function setRating(rating) {
    selectedRating = rating;
    const stars = document.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    trackFooterInteraction('rating_selected', { rating: rating });
}

function submitFeedback(event) {
    event.preventDefault();
    
    const feedbackText = document.getElementById('feedback').value;
    
    if (selectedRating === 0) {
        showNotification('Please select a rating before submitting.', 'warning');
        return;
    }
    
    // Simulate API call
    console.log('Submitting feedback:', {
        rating: selectedRating,
        feedback: feedbackText,
        timestamp: new Date().toISOString()
    });
    
    // Show success message
    showNotification('Thank you for your feedback! We appreciate your input.', 'success');
    
    // Close modal
    closeModal('feedbackModal');
    
    // Track feedback submission
    trackFooterInteraction('feedback_submitted', {
        rating: selectedRating,
        has_text: feedbackText.length > 0
    });
}

function resetFeedbackForm() {
    selectedRating = 0;
    document.querySelectorAll('.star').forEach(star => {
        star.classList.remove('active');
    });
    document.getElementById('feedbackForm').reset();
}

// Reservation functionality
function selectTimeSlot(button) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Add selection to clicked button
    button.classList.add('selected');
    selectedTimeSlot = button.textContent;
    
    trackFooterInteraction('time_slot_selected', { slot: selectedTimeSlot });
}

function confirmReservation() {
    if (!selectedTimeSlot) {
        showNotification('Please select a time slot first.', 'warning');
        return;
    }
    
    // Simulate API call
    console.log('Confirming reservation for:', selectedTimeSlot);
    
    // Show success message
    showNotification(`Reservation confirmed for ${selectedTimeSlot}!`, 'success');
    
    // Close modal
    closeModal('reserveModal');
    
    // Track reservation
    trackFooterInteraction('reservation_confirmed', { slot: selectedTimeSlot });
}

function resetReservationForm() {
    selectedTimeSlot = null;
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
}

// App download functionality
function downloadApp(platform) {
    const urls = {
        ios: 'https://apps.apple.com/us/app/walmart/id338137227',
        android: 'https://play.google.com/store/apps/details?id=com.walmart.android'
    };
    
    console.log(`Redirecting to ${platform} app store...`);
    
    // In a real application, you would redirect to the actual app store
    // window.open(urls[platform], '_blank');
    
    showNotification(`Redirecting to ${platform === 'ios' ? 'App Store' : 'Google Play'}...`, 'info');
    
    // Track app download attempt
    trackFooterInteraction('app_download_clicked', { platform: platform });
}

// Newsletter subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate API call
    console.log(`Subscribing email: ${email}`);
    
    // Show success message
    showNotification('Successfully subscribed to newsletter!', 'success');
    
    // Reset form
    event.target.reset();
    
    // Track newsletter subscription
    trackFooterInteraction('newsletter_subscribed', { email_domain: email.split('@')[1] });
}

// Social media links
function openSocial(platform) {
    const urls = {
        facebook: 'https://www.facebook.com/walmart',
        twitter: 'https://twitter.com/walmart',
        instagram: 'https://www.instagram.com/walmart',
        youtube: 'https://www.youtube.com/user/walmart',
        linkedin: 'https://www.linkedin.com/company/walmart'
    };
    
    console.log(`Opening ${platform} page...`);
    
    // In a real application, you would redirect to the actual social media page
    // window.open(urls[platform], '_blank');
    
    showNotification(`Opening ${platform.charAt(0).toUpperCase() + platform.slice(1)} page...`, 'info');
    
    // Track social media click
    trackFooterInteraction('social_media_clicked', { platform: platform });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

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

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
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

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Analytics tracking
function trackFooterInteraction(action, details = {}) {
    console.log('Footer interaction:', action, details);
    
    // In production, send to analytics service
    // Example implementations:
    // Google Analytics 4
    // gtag('event', action, { ...details, event_category: 'footer' });
    
    // Custom analytics
    // analytics.track('footer_interaction', { action, ...details });
    
    // Adobe Analytics
    // s.tl(true, 'o', action);
}

// Add click tracking to footer links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.footer-link').forEach(link => {
        link.addEventListener('click', function(e) {
            trackFooterInteraction('link_click', {
                link_text: this.textContent.trim(),
                link_url: this.href,
                section: this.closest('.footer-section').querySelector('.footer-title').textContent
            });
        });
    });
});

// Accessibility improvements
function setupAccessibility() {
    // Add keyboard navigation for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, textarea');
    
    interactiveElements.forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                if (this.tagName === 'BUTTON' || (this.tagName === 'A' && this.href)) {
                    if (e.key === ' ') e.preventDefault();
                    this.click();
                }
            }
        });
    });

    // Trap focus in modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                trapFocus(e, this);
            }
        });
    });
}

function trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
        }
    } else {
        if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
        }
    }
}

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Performance monitoring
function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Footer loaded in ${loadTime.toFixed(2)}ms`);
        
        trackFooterInteraction('page_loaded', {
            load_time: Math.round(loadTime),
            user_agent: navigator.userAgent
        });
    });

    // Monitor interaction performance
    let interactionCount = 0;
    document.addEventListener('click', function() {
        interactionCount++;
        if (interactionCount % 10 === 0) {
            trackFooterInteraction('interaction_milestone', {
                count: interactionCount
            });
        }
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Footer error:', e.error);
    trackFooterInteraction('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupAccessibility();
    initializePerformanceMonitoring();
    
    // Add animation keyframes via JavaScript for better browser support
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('Walmart Footer initialized successfully');
});

// Utility functions
const FooterUtils = {
    // Format date for display
    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },
    
    // Debounce function for performance
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Export for use in other modules (if using module system)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openModal,
        closeModal,
        setRating,
        submitFeedback,
        selectTimeSlot,
        confirmReservation,
        downloadApp,
        subscribeNewsletter,
        openSocial,
        showNotification,
        trackFooterInteraction,
        FooterUtils
    };
}