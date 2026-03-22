// Hotel Management System JavaScript

// Global Variables
let currentUser = null;
let currentRole = null;
let users = [];
let reservations = [];
let bookings = [];
let payments = [];

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
    return customerId.trim().length >= 5 && customerId.trim().length <= 20;
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
        showError('customerId', 'Customer ID must be between 5 and 20 characters');
        isValid = false;
    }

    // Check if customer ID already exists
    if (users && users.find(user => user.customerId === customerId)) {
        showError('customerId', 'Customer ID already exists');
        isValid = false;
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

    // Validate user ID
    if (!validateCustomerID(userId)) {
        showError('userId', 'User ID must be between 5 and 20 characters');
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
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    reservations.push(reservation);
    saveDataToStorage();

    showSuccess(`Reservation Successful. Your Booking ID: ${reservation.bookingId}`);

    // Reset form
    document.getElementById('reservationForm').reset();

    // Show notification after delay
    setTimeout(() => {
        showNotification();
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
