// Hotel Management System JavaScript

// Global Variables
let currentUser = null;
let currentRole = null;
let users = [];
let reservations = [];
let bookings = [];
let payments = [];

// Generate unique 13-digit Customer ID
function generateUniqueCustomerId() {
    let customerId;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 100;

    const users = JSON.parse(localStorage.getItem('hotelUsers')) || [];

    while (!isUnique && attempts < maxAttempts) {
        // Generate 13-digit number with timestamp and random components
        const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
        const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0'); // 5 random digits
        customerId = timestamp + random; // Total 13 digits

        // Check if this ID already exists
        isUnique = !users.some(user => user.customerId === customerId);

        attempts++;
    }

    return customerId;
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification-popup');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-popup alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideInRight 0.3s ease-out;
    `;

    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Success notification
function showSuccess(message) {
    showNotification(message, 'success');
}

// Error notification
function showError(message) {
    showNotification(message, 'danger');
}

// Add animation styles
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

// Date validation utility functions
function initializeDateValidation(dateInputId, minDate = 'today') {
    const dateInput = document.getElementById(dateInputId);
    if (!dateInput) return;

    // Set minimum date
    let minDateValue;
    if (minDate === 'today') {
        minDateValue = new Date().toISOString().split('T')[0];
    } else {
        minDateValue = minDate;
    }
    dateInput.setAttribute('min', minDateValue);

    // Add validation listener
    dateInput.addEventListener('change', function () {
        validateDateInput(this);
    });

    dateInput.addEventListener('blur', function () {
        validateDateInput(this);
    });
}

function validateDateInput(input) {
    const selectedDate = new Date(input.value);
    const minDate = new Date(input.getAttribute('min'));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    input.classList.remove('is-invalid', 'is-valid');

    if (!input.value) {
        input.classList.add('is-invalid');
        return false;
    }

    if (selectedDate < minDate) {
        input.classList.add('is-invalid');
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = 'Date cannot be in the past';
        }
        return false;
    }

    input.classList.add('is-valid');
    return true;
}

function validateDateRange(checkInId, checkOutId) {
    const checkIn = document.getElementById(checkInId);
    const checkOut = document.getElementById(checkOutId);

    if (!checkIn || !checkOut) return false;

    const checkInDate = new Date(checkIn.value);
    const checkOutDate = new Date(checkOut.value);

    // Update check-out minimum when check-in changes
    checkIn.addEventListener('change', function () {
        const nextDay = new Date(checkInDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const minCheckOut = nextDay.toISOString().split('T')[0];
        checkOut.setAttribute('min', minCheckOut);

        // Clear check-out if it's before new minimum
        if (checkOut.value && checkOutDate <= checkInDate) {
            checkOut.value = '';
            checkOut.classList.remove('is-valid');
        }
    });

    // Validate check-out date
    checkOut.addEventListener('change', function () {
        if (checkOutDate <= checkInDate) {
            checkOut.classList.add('is-invalid');
            const feedback = checkOut.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.textContent = 'Check-out date must be after check-in date';
            }
        } else {
            checkOut.classList.remove('is-invalid');
            checkOut.classList.add('is-valid');
        }
    });

    return true;
}

// Global date validation initialization
function initializeAllDateValidation() {
    // Initialize all date inputs with today as minimum
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        // Skip filter inputs (they should allow past dates)
        if (input.id.includes('Filter') || input.id.includes('filter')) {
            return;
        }

        // Check if it's part of a date range
        if (input.id.includes('checkIn') || input.id.includes('CheckIn')) {
            const checkOutId = input.id.replace('checkIn', 'checkOut').replace('CheckIn', 'CheckOut');
            validateDateRange(input.id, checkOutId);
        } else if (input.id.includes('checkOut') || input.id.includes('CheckOut')) {
            const checkInId = input.id.replace('checkOut', 'checkIn').replace('CheckOut', 'CheckIn');
            validateDateRange(checkInId, input.id);
        } else {
            initializeDateValidation(input.id);
        }
    });
}

// Initialize date validation on DOM load
document.addEventListener('DOMContentLoaded', function () {
    initializeAllDateValidation();
    initializeFilterRefresh();
    initializeFeedbackMonitoring();
});

// Initialize feedback monitoring for admin
function initializeFeedbackMonitoring() {
    // Only monitor if we're on admin pages
    if (window.location.href.includes('admin-')) {
        let lastFeedbackCount = JSON.parse(localStorage.getItem('feedbacks') || []).length;

        // Check for new feedback every 10 seconds
        setInterval(() => {
            const currentFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || []);
            if (currentFeedbacks.length > lastFeedbackCount) {
                // New feedback submitted
                const newFeedback = currentFeedbacks[currentFeedbacks.length - 1];
                showNotification(`New feedback received! ID: ${newFeedback.complaintId}`, 'info');
                lastFeedbackCount = currentFeedbacks.length;

                // Auto-refresh if we're on the feedback page
                if (typeof loadFeedbacks === 'function') {
                    loadFeedbacks();
                    updateStatistics();
                }
            }
        }, 10000);
    }
}

// Enhanced notification system with feedback alerts
function showFeedbackAlert(feedback) {
    const notification = document.createElement('div');
    notification.className = 'notification-popup alert alert-info alert-dismissible fade show position-fixed';
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 400px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideInRight 0.3s ease-out;
    `;

    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-bell me-3"></i>
            <div class="flex-grow-1">
                <strong>New Feedback Received!</strong><br>
                <small>ID: ${feedback.complaintId} | ${feedback.complaintType} | Priority: ${feedback.priority}</small>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto remove after 8 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 8000);
}

// Initialize filter refresh for live data
function initializeFilterRefresh() {
    // Auto-refresh filters every 30 seconds
    setInterval(() => {
        refreshAllFilters();
    }, 30000);
}

// Refresh all active filters
function refreshAllFilters() {
    // Check if we're on a page with filters and refresh them
    if (typeof filterReservations === 'function' && document.getElementById('statusFilter')) {
        filterReservations();
    }
    if (typeof filterBookings === 'function' && document.getElementById('statusFilter')) {
        filterBookings();
    }
    if (typeof filterHistory === 'function' && document.getElementById('statusFilter')) {
        filterHistory();
    }
}

// Enhanced filter functions with live data
function enhanceFilterWithLiveData(filterFunction) {
    return function (...args) {
        // Ensure we have the latest data before filtering
        loadDataFromStorage();
        return filterFunction.apply(this, args);
    };
}

// Utility function to get live filtered data
function getLiveFilteredData(baseArray, filters) {
    let filteredData = [...baseArray];

    // Apply all filters
    Object.keys(filters).forEach(key => {
        const filterValue = filters[key];
        if (filterValue && filterValue !== 'all') {
            switch (key) {
                case 'status':
                    filteredData = filteredData.filter(item => item.status === filterValue);
                    break;
                case 'date':
                    filteredData = filteredData.filter(item => item.checkIn === filterValue);
                    break;
                case 'month':
                    filteredData = filteredData.filter(item => {
                        const itemDate = new Date(item.checkIn);
                        const [year, month] = filterValue.split('-');
                        return itemDate.getFullYear() == year && (itemDate.getMonth() + 1) == month;
                    });
                    break;
                case 'search':
                    filteredData = filteredData.filter(item =>
                        item.bookingId.toLowerCase().includes(filterValue.toLowerCase())
                    );
                    break;
                case 'roomType':
                    filteredData = filteredData.filter(item => item.roomType === filterValue);
                    break;
                case 'floor':
                    filteredData = filteredData.filter(item => {
                        const floor = Math.floor(item.roomNumber / 100);
                        return floor == filterValue;
                    });
                    break;
                case 'guest':
                    filteredData = filteredData.filter(item =>
                        item.name.toLowerCase().includes(filterValue.toLowerCase())
                    );
                    break;
            }
        }
    });

    return filteredData;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    // Load data from localStorage
    loadDataFromStorage();

    // Check if user is logged in
    checkLoginStatus();

    // Initialize event listeners
    initializeEventListeners();
});

// Load data from localStorage
function loadDataFromStorage() {
    const storedUsers = localStorage.getItem('hotelUsers');
    const storedReservations = localStorage.getItem('hotelReservations');
    const storedBookings = localStorage.getItem('hotelBookings');
    const storedPayments = localStorage.getItem('hotelPayments');

    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
    if (storedReservations) {
        reservations = JSON.parse(storedReservations);
    }
    if (storedBookings) {
        bookings = JSON.parse(storedBookings);
    }
    if (storedPayments) {
        payments = JSON.parse(storedPayments);
    }
}

// Save data to localStorage
function saveDataToStorage() {
    localStorage.setItem('hotelUsers', JSON.stringify(users));
    localStorage.setItem('hotelReservations', JSON.stringify(reservations));
    localStorage.setItem('hotelBookings', JSON.stringify(bookings));
    localStorage.setItem('hotelPayments', JSON.stringify(payments));
}

// Check login status
function checkLoginStatus() {
    const loggedInUser = sessionStorage.getItem('currentUser');
    const userRole = sessionStorage.getItem('userRole');

    if (loggedInUser && userRole) {
        currentUser = loggedInUser;
        currentRole = userRole;

        // Update UI based on login status
        updateLoginUI();
    }
}

// Update login UI
function updateLoginUI() {
    const welcomeElements = document.querySelectorAll('.welcome-user');
    welcomeElements.forEach(element => {
        element.textContent = `Welcome ${currentUser}`;
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Reservation form
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservation);
    }

    // Payment form
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePayment);
    }

    // Support form
    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', handleSupport);
    }

    // Logout buttons
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', handleLogout);
    });
}

// Validation Functions
function validateName(name) {
    return name.trim().length >= 1 && name.trim().length <= 50;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateMobile(mobile) {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
}

function validateCustomerID(customerId) {
    // Accept 13-digit auto-generated Customer IDs
    return customerId.trim().length === 13 && /^\d{13}$/.test(customerId);
}

function validateUserIdOrEmail(userIdOrEmail) {
    const trimmedValue = userIdOrEmail.trim();

    // Check if it's a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(trimmedValue)) {
        return true;
    }

    // Check if it's a valid Customer ID (13 digits)
    if (/^\d{13}$/.test(trimmedValue)) {
        return true;
    }

    // Check if it's a valid username (5-50 characters, alphanumeric and spaces)
    if (trimmedValue.length >= 5 && trimmedValue.length <= 50 && /^[a-zA-Z0-9\s]+$/.test(trimmedValue)) {
        return true;
    }

    // Check if it's Admin
    if (trimmedValue === 'Admin') {
        return true;
    }

    return false;
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{1,30}$/;
    return passwordRegex.test(password);
}

function validateCardNumber(cardNumber) {
    const cardRegex = /^\d{16}$/;
    return cardRegex.test(cardNumber.replace(/\s/g, ''));
}

function validateCardHolderName(name) {
    return name.trim().length >= 10;
}

function validateExpiry(expiry) {
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return expiryRegex.test(expiry);
}

function validateCVV(cvv) {
    const cvvRegex = /^\d{3}$/;
    return cvvRegex.test(cvv);
}

// Show error message
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorDiv = input.parentElement.querySelector('.invalid-feedback') ||
        input.parentElement.nextElementSibling;

    if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    input.classList.add('is-invalid');
}

// Clear error message
function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorDiv = input.parentElement.querySelector('.invalid-feedback') ||
        input.parentElement.nextElementSibling;

    if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
        errorDiv.style.display = 'none';
    }

    input.classList.remove('is-invalid');
}

// Show success message
function showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Try to find container, then register-card, then body
    let container = document.querySelector('.container') ||
        document.querySelector('.register-card') ||
        document.querySelector('.login-card') ||
        document.body;

    if (container === document.body) {
        container.insertBefore(alertDiv, container.firstChild);
    } else {
        container.insertBefore(alertDiv, container.firstChild);
    }

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Show error alert
function showErrorAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        <strong>Error!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    document.body.appendChild(alertDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Show popup notification
function showPopup(title, message, type = 'success') {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'notification-popup';

    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const color = type === 'success' ? '#28a745' : '#dc3545';

    popup.innerHTML = `
        <div style="text-align: center;">
            <i class="fas ${icon}" style="font-size: 48px; color: ${color}; margin-bottom: 20px;"></i>
            <h3 style="margin-bottom: 15px; color: #333;">${title}</h3>
            <p style="margin-bottom: 25px; color: #666; line-height: 1.5;">${message}</p>
            <button onclick="this.parentElement.parentElement.parentElement.remove();" 
                    style="background: ${color}; color: white; border: none; padding: 10px 30px; 
                           border-radius: 5px; cursor: pointer; font-size: 16px;">
                OK
            </button>
        </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Auto-remove after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 5000);
    }
}

// Generate random ID
function generateRandomId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Room allocation system
let allocatedRooms = {};

// Allocate room number based on room type and availability
function allocateRoomNumber(roomType) {
    const roomRanges = {
        'standard': { min: 100, max: 199 },
        'deluxe': { min: 200, max: 299 },
        'suite': { min: 300, max: 399 },
        'presidential': { min: 400, max: 499 }
    };

    const range = roomRanges[roomType] || roomRanges['standard'];

    // Find first available room in the range
    for (let roomNum = range.min; roomNum <= range.max; roomNum++) {
        if (!allocatedRooms[roomNum]) {
            allocatedRooms[roomNum] = true;
            return roomNum;
        }
    }

    // If no rooms available, return random in range
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

// Generate booking ID
function generateBookingId() {
    return 'BK' + Date.now();
}

// Generate transaction ID
function generateTransactionId() {
    return 'TXN' + Date.now();
}

// Handle Registration
function handleRegistration(event) {
    event.preventDefault();

    console.log('Registration function called'); // Debug log

    // Clear previous errors
    clearAllErrors();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const countryCode = document.getElementById('countryCode').value;
    const mobile = document.getElementById('mobile').value;
    const address = document.getElementById('address').value;
    const customerId = document.getElementById('customerId').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let isValid = true;

    // Validate name
    if (!validateName(name)) {
        showError('name', 'Name must be between 1 and 50 characters');
        isValid = false;
    }

    // Validate email
    if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate mobile
    if (!validateMobile(mobile)) {
        showError('mobile', 'Mobile number must be exactly 10 digits');
        isValid = false;
    }

    // Validate address
    if (!address.trim()) {
        showError('address', 'Address is required');
        isValid = false;
    }

    // Validate customer ID
    if (!validateCustomerID(customerId)) {
        showError('customerId', 'Invalid Customer ID format');
        isValid = false;
    }

    // Check if customer ID already exists and regenerate if needed
    if (users && users.find(user => user.customerId === customerId)) {
        // Customer ID already exists, generate a new one
        const newCustomerId = generateUniqueCustomerId();

        if (newCustomerId) {
            // Update the field with the new ID
            document.getElementById('customerId').value = newCustomerId;
            isValid = true;
        } else {
            showError('customerId', 'Unable to generate unique Customer ID. Please try again.');
            isValid = false;
        }
    }

    // Validate password
    if (!validatePassword(password)) {
        showError('password', 'Password must contain uppercase, lowercase, and special character');
        isValid = false;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Create new user
    const newUser = {
        userId: generateRandomId(),
        name: name,
        email: email,
        mobile: countryCode + mobile,
        address: address,
        customerId: customerId,
        password: password,
        role: 'customer',
        createdAt: new Date().toISOString()
    };

    // Add to users array
    if (!users) {
        users = [];
    }
    users.push(newUser);

    // Save to localStorage
    saveDataToStorage();

    // Show success message
    console.log('Showing success message'); // Debug log
    showPopup('Registration Successful!', `Congratulations! Your registration was successful.<br><br><strong>Your User ID:</strong> ${newUser.userId}<br><strong>Your Customer ID:</strong> ${newUser.customerId}<br><br>Please save these details for future login.`, 'success');

    // Reset form
    document.getElementById('registerForm').reset();

    // Redirect to login after 3 seconds
    setTimeout(() => {
        console.log('Redirecting to login page'); // Debug log
        window.location.href = 'index.html';
    }, 3000);
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();

    console.log('Login function called'); // Debug log

    // Clear previous errors
    clearAllErrors();

    // Get form values
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;

    console.log('Login attempt:', { userId, password }); // Debug log

    let isValid = true;

    // Validate user ID (accept User ID, Username, or Email)
    if (!validateUserIdOrEmail(userId)) {
        showError('userId', 'Please enter a valid User ID, Username, or Email');
        isValid = false;
    }

    // Validate password
    if (!validatePassword(password)) {
        showError('password', 'Password must contain uppercase, lowercase, and special character');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Check admin credentials
    console.log('Checking admin credentials:', { userId, password }); // Debug log
    if (userId === 'Admin' && password === 'Admin@123') {
        console.log('Admin login successful'); // Debug log
        currentUser = 'Admin';
        currentRole = 'admin';
        sessionStorage.setItem('currentUser', currentUser);
        sessionStorage.setItem('userRole', currentRole);
        sessionStorage.setItem('userId', 'Admin'); // Add userId for admin
        sessionStorage.setItem('loggedInUser', 'Admin'); // Add for compatibility
        window.location.href = 'admin-dashboard.html';
        return;
    }

    // Check customer credentials
    if (users) {
        // Try to find user by userId, username (name), or email
        const user = users.find(u =>
            (u.customerId === userId || u.userId === userId) && u.password === password ||
            (u.name && u.name.toLowerCase() === userId.toLowerCase() && u.password === password) ||
            (u.email && u.email.toLowerCase() === userId.toLowerCase() && u.password === password)
        );

        if (user) {
            console.log('Customer login successful:', user.name); // Debug log
            currentUser = user.name;
            currentRole = 'customer';
            sessionStorage.setItem('currentUser', currentUser);
            sessionStorage.setItem('userRole', currentRole);
            sessionStorage.setItem('userId', user.userId);
            sessionStorage.setItem('loggedInUser', user.userId); // Add for compatibility
            sessionStorage.setItem('customerId', user.customerId);
            window.location.href = 'dashboard.html';
            return;
        }
    }

    // Invalid credentials
    showPopup('Login Failed', 'Invalid User ID or Password. Please check your credentials and try again.', 'error');
}

// Handle Reservation
function handleReservation(event) {
    event.preventDefault();

    // Get form values
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const roomType = document.getElementById('roomType').value;
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;

    // Validate dates
    if (!checkIn || !checkOut) {
        showErrorAlert('Please select check-in and check-out dates');
        return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
        showErrorAlert('Check-out date must be after check-in date');
        return;
    }

    // Create reservation
    const reservation = {
        bookingId: generateBookingId(),
        userId: sessionStorage.getItem('userId'),
        customerId: sessionStorage.getItem('customerId'),
        name: name,
        contact: contact,
        checkIn: checkIn,
        checkOut: checkOut,
        roomType: roomType,
        roomNumber: allocateRoomNumber(roomType),
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    // Calculate amount for reservation
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    const roomRates = {
        'standard': 2000,
        'deluxe': 3000,
        'suite': 5000,
        'presidential': 8000
    };

    const roomRate = roomRates[roomType] || 2000;
    const roomCharges = nights * roomRate;
    const gst = Math.round(roomCharges * 0.18);
    const totalAmount = roomCharges + gst;

    reservation.amount = totalAmount;
    reservation.nights = nights;
    reservation.roomRate = roomRate;

    reservations.push(reservation);
    saveDataToStorage();

    showSuccess(`Reservation Successful. Your Booking ID: ${reservation.bookingId}`);

    // Reset form
    document.getElementById('reservationForm').reset();

    // Redirect to billing page after delay
    setTimeout(() => {
        window.location.href = 'billing.html';
    }, 2000);
}

// Handle Payment
function handlePayment(event) {
    event.preventDefault();

    // Get form values
    const cardNumber = document.getElementById('cardNumber').value;
    const cardHolderName = document.getElementById('cardHolderName').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    let isValid = true;

    // Validate card number
    if (!validateCardNumber(cardNumber)) {
        showError('cardNumber', 'Card number must be 16 digits');
        isValid = false;
    }

    // Validate card holder name
    if (!validateCardHolderName(cardHolderName)) {
        showError('cardHolderName', 'Card holder name must be at least 10 characters');
        isValid = false;
    }

    // Validate expiry
    if (!validateExpiry(expiry)) {
        showError('expiry', 'Expiry date must be in MM/YY format');
        isValid = false;
    }

    // Validate CVV
    if (!validateCVV(cvv)) {
        showError('cvv', 'CVV must be 3 digits');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Create payment record
    const payment = {
        transactionId: generateTransactionId(),
        userId: sessionStorage.getItem('userId'),
        amount: document.getElementById('billAmount').textContent,
        paymentMode: document.querySelector('input[name="paymentMode"]:checked').value,
        cardNumber: '****-****-****-' + cardNumber.slice(-4),
        createdAt: new Date().toISOString()
    };

    payments.push(payment);
    saveDataToStorage();

    // Show success message with transaction details
    showPaymentSuccess(payment);

    // Reset form
    document.getElementById('paymentForm').reset();
}

// Handle Support
function handleSupport(event) {
    event.preventDefault();

    // Get form values
    const complaintType = document.getElementById('complaintType').value;
    const roomNumber = document.getElementById('roomNumber').value;
    const contact = document.getElementById('contact').value;
    const customerId = document.getElementById('customerId').value;

    // Validate required fields
    if (!complaintType || !roomNumber || !contact || !customerId) {
        showErrorAlert('Please fill all required fields');
        return;
    }

    showSuccess('Your complaint has been submitted. We will contact you soon.');

    // Reset form
    document.getElementById('supportForm').reset();
}

// Handle Logout
function handleLogout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('customerId');

    window.location.href = 'index.html';
}

// Clear all errors
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.is-invalid');
    errorElements.forEach(element => {
        element.classList.remove('is-invalid');
    });

    const errorMessages = document.querySelectorAll('.invalid-feedback');
    errorMessages.forEach(element => {
        element.style.display = 'none';
    });
}

// Show notification popup
function showNotification() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'notification-popup';
    popup.innerHTML = `
        <h3>Thank You!</h3>
        <p>Thank you for choosing us, a trusted hotel. For more details contact customer support.</p>
        <button class="btn btn-primary mt-3" onclick="goToSupport()">Go to Support</button>
        <button class="btn btn-secondary mt-3 ms-2" onclick="closeNotification()">Close</button>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(popup);
}

// Close notification
function closeNotification() {
    const overlay = document.querySelector('.notification-overlay');
    const popup = document.querySelector('.notification-popup');

    if (overlay) overlay.remove();
    if (popup) popup.remove();
}

// Go to support page
function goToSupport() {
    closeNotification();
    window.location.href = 'support.html';
}

// Show payment success
function showPaymentSuccess(payment) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Payment Successful</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-success">
                        <h4>Payment Completed Successfully!</h4>
                        <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
                        <p><strong>Amount:</strong> ₹${payment.amount}</p>
                        <p><strong>Payment Mode:</strong> ${payment.paymentMode}</p>
                        <p><strong>Card:</strong> ${payment.cardNumber}</p>
                    </div>
                    <p>Your invoice has been generated and sent to your email.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="window.location.href='dashboard.html'">Go to Dashboard</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    // Remove modal after hiding
    modal.addEventListener('hidden.bs.modal', () => {
        modal.remove();
    });
}

// Load booking history
function loadBookingHistory() {
    const userId = sessionStorage.getItem('userId');
    const historyTable = document.getElementById('historyTable');

    if (!historyTable) return;

    const userBookings = bookings.filter(booking => booking.userId === userId);

    if (userBookings.length === 0) {
        historyTable.innerHTML = '<tr><td colspan="6" class="text-center">No bookings found</td></tr>';
        return;
    }

    let html = '';
    userBookings.forEach(booking => {
        html += `
            <tr>
                <td>${booking.bookingId}</td>
                <td>${booking.checkIn}</td>
                <td>${booking.checkOut}</td>
                <td>${booking.roomNumber || 'N/A'}</td>
                <td>₹${booking.amount || '0'}</td>
                <td>${new Date(booking.createdAt).toLocaleDateString()}</td>
            </tr>
        `;
    });

    historyTable.innerHTML = html;
}

// Load room status
function loadRoomStatus() {
    const customerId = document.getElementById('customerIdInput').value;
    const roomTable = document.getElementById('roomTable');

    if (!roomTable) return;

    // Generate room status data (mock data)
    const rooms = [
        { floor: 1, number: 101, status: 'vacant', price: 2000 },
        { floor: 1, number: 102, status: 'booked', price: 2000 },
        { floor: 1, number: 103, status: 'vacant', price: 2500 },
        { floor: 2, number: 201, status: 'vacant', price: 3000 },
        { floor: 2, number: 202, status: 'booked', price: 3000 },
        { floor: 2, number: 203, status: 'vacant', price: 3500 },
        { floor: 3, number: 301, status: 'vacant', price: 4000 },
        { floor: 3, number: 302, status: 'booked', price: 4000 },
        { floor: 3, number: 303, status: 'vacant', price: 4500 }
    ];

    let html = '';
    rooms.forEach(room => {
        const statusClass = room.status === 'vacant' ? 'room-vacant' : 'room-booked';
        html += `
            <tr>
                <td>${room.floor}</td>
                <td>${room.number}</td>
                <td><span class="${statusClass}">${room.status.toUpperCase()}</span></td>
                <td>₹${room.price}</td>
            </tr>
        `;
    });

    roomTable.innerHTML = html;
}

// Load upcoming bookings
function loadUpcomingBookings() {
    const userId = sessionStorage.getItem('userId');
    const bookingsTable = document.getElementById('bookingsTable');

    if (!bookingsTable) return;

    const userBookings = bookings.filter(booking =>
        booking.userId === userId &&
        new Date(booking.checkIn) > new Date()
    );

    if (userBookings.length === 0) {
        bookingsTable.innerHTML = '<tr><td colspan="4" class="text-center">No upcoming bookings</td></tr>';
        return;
    }

    let html = '';
    userBookings.forEach(booking => {
        html += `
            <tr>
                <td>${booking.bookingId}</td>
                <td>${booking.checkIn}</td>
                <td>${booking.checkOut}</td>
                <td>${booking.roomNumber || 'N/A'}</td>
            </tr>
        `;
    });

    bookingsTable.innerHTML = html;
}

// Load admin reservations
function loadAdminReservations() {
    const reservationsTable = document.getElementById('reservationsTable');

    if (!reservationsTable) return;

    const pendingReservations = reservations.filter(res => res.status === 'pending');

    if (pendingReservations.length === 0) {
        reservationsTable.innerHTML = '<tr><td colspan="6" class="text-center">No pending reservations</td></tr>';
        return;
    }

    let html = '';
    pendingReservations.forEach(reservation => {
        html += `
            <tr>
                <td>${reservation.bookingId}</td>
                <td>${reservation.name}</td>
                <td>${reservation.contact}</td>
                <td>${reservation.checkIn}</td>
                <td>${reservation.checkOut}</td>
                <td>${reservation.roomType}</td>
                <td>
                    <select class="form-select" onchange="updateReservationStatus('${reservation.bookingId}', this.value)">
                        <option value="pending">Pending</option>
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                    </select>
                </td>
            </tr>
        `;
    });

    reservationsTable.innerHTML = html;
}

// Update reservation status
function updateReservationStatus(bookingId, status) {
    const reservation = reservations.find(res => res.bookingId === bookingId);
    if (reservation) {
        reservation.status = status;
        saveDataToStorage();

        if (status === 'approved') {
            showSuccess(`Reservation ${bookingId} has been approved`);
        } else if (status === 'rejected') {
            showSuccess(`Reservation ${bookingId} has been rejected`);
        }
    }
}

// Initialize users array if not exists
users = users || [];
