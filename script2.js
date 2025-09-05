// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 50,
    easing: 'ease-out-cubic'
});

// Cart functionality
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// Create particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const maxParticles = window.innerWidth < 768 ? 8 : 15;
    
    setInterval(() => {
        if (document.querySelectorAll('.particle').length < maxParticles) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = window.innerWidth < 768 ? Math.random() * 25 + 5 : Math.random() * 40 + 10;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.bottom = '0px';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            particlesContainer.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 8000);
        }
    }, window.innerWidth < 768 ? 1200 : 800);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Counter animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Initialize counters when stats section is visible
const observerOptions = {
    threshold: 0.7,
    rootMargin: '0px 0px -100px 0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(document.getElementById('years-counter'), 11);
            animateCounter(document.getElementById('customers-counter'), 850);
            animateCounter(document.getElementById('products-counter'), 15);
            animateCounter(document.getElementById('delivery-counter'), 200);
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Cart functions
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }
    
    updateCartDisplay();
    showNotification(productName + ' added to cart!', 'success');
}

function updateCartDisplay() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    document.getElementById('cart-count').textContent = cartCount;
    
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price} each</div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">Qty: ${item.quantity}</div>
                    <div class="cart-item-total">₹${item.price * item.quantity}</div>
                    <button onclick="removeFromCart(${index})" class="remove-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    document.getElementById('cart-total').innerHTML = 'Total: <span>₹' + cartTotal + '</span>';
}

function removeFromCart(index) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    updateCartDisplay();
    showNotification(removedItem.name + ' removed from cart', 'warning');
}

function openCart() {
    const modal = document.getElementById('cartModal');
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    showNotification('Thank you for your order! Total: ₹' + cartTotal + '. We will contact you soon for delivery details.', 'success');
    cart = [];
    updateCartDisplay();
    closeCart();
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    const isMobile = window.innerWidth < 768;
    
    notification.className = 'notification ' + type;
    notification.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle') + '"></i>' + message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

function handleSubmit(event) {
    event.preventDefault();
    showNotification('Thank you for your message! We will contact you soon.', 'success');
    event.target.reset();
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = window.innerWidth < 768 ? 60 : 80;
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Close cart when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        closeCart();
    }
});

// Initialize everything
window.addEventListener('load', () => {
    createParticles();
    updateCartDisplay();
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Lazy load background video on mobile for performance
    if (window.innerWidth < 768) {
        const video = document.querySelector('.hero-video');
        if (video) {
            video.style.opacity = '0.3';
        }
    }
});
