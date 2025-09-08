// Global state
let cart = JSON.parse(localStorage.getItem('homedelish-cart') || '[]');
let menuItems = [];
let featuredItems = [];

// Sample menu data (since we're not using the backend API)
const sampleMenuData = [
    {
        id: 1,
        name: "Homemade Lasagna",
        description: "Layers of pasta, rich meat sauce, and melted cheese",
        price: "18.99",
        image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "mains",
        featured: true
    },
    {
        id: 2,
        name: "Grilled Chicken & Veggies",
        description: "Perfectly seasoned chicken with roasted vegetables",
        price: "16.99",
        image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "mains",
        featured: true
    },
    {
        id: 3,
        name: "Fresh Garden Salad",
        description: "Mixed greens with seasonal vegetables and dressing",
        price: "12.99",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "mains",
        featured: true
    },
    {
        id: 4,
        name: "Hearty Beef Stew",
        description: "Tender beef with vegetables in rich gravy",
        price: "19.99",
        image: "https://images.media-allrecipes.com/userphotos/960x960/4552433.jpg",
        category: "mains",
        featured: false
    },
    {
        id: 5,
        name: "Seafood Pasta",
        description: "Fresh shrimp and mussels in creamy sauce",
        price: "22.99",
        image: "https://thebigmansworld.com/wp-content/uploads/2023/01/seafood-pasta-recipe.jpg",
        category: "mains",
        featured: false
    },
    {
        id: 6,
        name: "Roasted Turkey Dinner",
        description: "Traditional roasted turkey with all the fixings",
        price: "24.99",
        image: "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "mains",
        featured: false
    },
    {
        id: 7,
        name: "Vegetarian Curry",
        description: "Aromatic vegetables in rich coconut curry",
        price: "17.99",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "mains",
        featured: false
    },
    {
        id: 8,
        name: "Homemade Spring Rolls",
        description: "Crispy rolls with fresh vegetables",
        price: "8.99",
        image: "https://tse1.mm.bing.net/th?id=OIP.V2dOf1O123uNigDpbgP7qgHaE8&pid=Api&P=0&h=180",
        category: "appetizers",
        featured: false
    },
    {
        id: 9,
        name: "Stuffed Mushrooms",
        description: "Mushrooms filled with herbs and cheese",
        price: "9.99",
        image: "https://tse3.mm.bing.net/th?id=OIP.GCWCOMMLIEfGVL-YX3eoYgHaKa&pid=Api&P=0&h=180",
        category: "appetizers",
        featured: false
    },
    {
        id: 10,
        name: "Homemade Apple Pie",
        description: "Classic apple pie with flaky crust",
        price: "6.99",
        image: "https://tse3.mm.bing.net/th?id=OIP.VVYhG49E_-FbHaMTiZxZYQHaEK&pid=Api&P=0&h=180",
        category: "desserts",
        featured: false
    },
    {
        id: 11,
        name: "Chocolate Brownie",
        description: "Rich brownie with vanilla ice cream",
        price: "7.99",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "desserts",
        featured: false
    }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadMenuData();
    updateCartUI();
    updateCartCount();
});

function initializeApp() {
    // Set initial active section
    showSection('home');
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('href').substring(1);
            showSection(section);
            closeMobileMenu();
        });
    });

    // Mobile menu
    document.getElementById('mobileMenuBtn').addEventListener('click', openMobileMenu);
    document.getElementById('mobileMenuClose').addEventListener('click', closeMobileMenu);

    // Cart
    document.getElementById('cartBtn').addEventListener('click', openCart);
    document.getElementById('cartClose').addEventListener('click', closeCart);
    document.getElementById('checkoutBtn').addEventListener('click', goToCheckout);

    // Overlay
    document.getElementById('overlay').addEventListener('click', function() {
        closeCart();
        closeMobileMenu();
    });

    // Category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterMenu(category);
            
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Forms
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckoutForm);
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    document.getElementById(sectionId).classList.add('active');
    
    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
        }
    });

    // Special handling for checkout
    if (sectionId === 'checkout') {
        updateCheckoutPage();
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function openMobileMenu() {
    document.getElementById('mobileMenu').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function openCart() {
    document.getElementById('cartSidebar').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function loadMenuData() {
    menuItems = sampleMenuData;
    featuredItems = menuItems.filter(item => item.featured);
    
    renderFeaturedItems();
    renderMenuItems();
}

function renderFeaturedItems() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    
    grid.innerHTML = featuredItems.map(item => createMenuItemHTML(item)).join('');
}

function renderMenuItems(category = 'all') {
    const grid = document.getElementById('menuGrid');
    if (!grid) return;
    
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    grid.innerHTML = filteredItems.map(item => createMenuItemHTML(item)).join('');
}

function createMenuItemHTML(item) {
    return `
        <div class="menu-item fade-in">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="menu-item-content">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">$${item.price}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

function filterMenu(category) {
    renderMenuItems(category);
}

function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    updateCartCount();
    showToast(`${item.name} added to cart!`);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartUI();
    updateCartCount();
}

function updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartUI();
        updateCartCount();
    }
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <span>Add some delicious items to get started!</span>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        cartFooter.style.display = 'block';
        updateCartTotal();
    }
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * item.quantity);
    }, 0);
    
    document.getElementById('cartTotal').textContent = total.toFixed(2);
}

function saveCart() {
    localStorage.setItem('homedelish-cart', JSON.stringify(cart));
}

function goToCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    closeCart();
    showSection('checkout');
}

function updateCheckoutPage() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (cart.length === 0) {
        showSection('menu');
        showToast('Your cart is empty!');
        return;
    }
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div class="checkout-item-info">
                <h4>${item.name}</h4>
                <p>Qty: ${item.quantity}</p>
            </div>
            <span class="checkout-item-price">
                $${(parseFloat(item.price) * item.quantity).toFixed(2)}
            </span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * item.quantity);
    }, 0);
    
    checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    const submitBtn = e.target.querySelector('.submit-btn');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showToast('Message sent successfully!');
        e.target.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }, 1000);
}

function handleCheckoutForm(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Simulate order placement
    const submitBtn = e.target.querySelector('.submit-btn');
    submitBtn.textContent = 'Placing Order...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const orderId = Math.floor(Math.random() * 10000) + 1000;
        showToast(`Order #${orderId} placed successfully!`);
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();
        
        // Reset form
        e.target.reset();
        submitBtn.textContent = 'Place Order';
        submitBtn.disabled = false;
        
        // Go back to home
        showSection('home');
    }, 2000);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth scrolling behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add intersection observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animations
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});