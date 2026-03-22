# Hotel Management System

A comprehensive front-end Hotel Management System built with HTML, CSS, Bootstrap, and JavaScript. This system provides complete functionality for both customers and administrators to manage hotel reservations, billing, and support services.

## 🏨 Features

### Customer Features
- **User Registration & Login**: Secure registration with validation and role-based authentication
- **Dashboard**: Personalized dashboard with quick access to all features
- **Reservation System**: Easy room booking with date selection and room preferences
- **Billing Management**: View detailed bills with breakdown of charges
- **Payment Gateway**: Secure payment processing with card validation
- **Booking History**: Track all past and upcoming reservations
- **Upcoming Bookings**: Manage future reservations with modification options
- **Customer Support**: 24/7 support with complaint and feedback system

### Admin Features
- **Admin Dashboard**: Comprehensive overview with statistics and metrics
- **Reservation Management**: Approve/reject pending reservations
- **Billing & Invoicing**: Generate invoices for customers
- **Booking History**: View and manage all user booking histories
- **Room Status Management**: Real-time room availability tracking
- **All Bookings Management**: Complete control over hotel bookings
- **Customer Support**: Handle complaints and feedback efficiently

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5.3.0
- **Icons**: Font Awesome 6.0.0
- **Data Storage**: LocalStorage & SessionStorage
- **Validation**: Client-side JavaScript validation with regex patterns

## 🎨 Design & Theming

The system uses a professional hotel-themed color palette:
- **Primary**: #1E3A5F (Deep Blue)
- **Secondary**: #F4A261 (Warm Gold)  
- **Background**: #F8F9FA (Light Gray)
- **Accent**: #2A9D8F (Teal)
- **Error**: #E63946 (Red)
- **Success**: #2ECC71 (Green)

## 📁 Project Structure

```
Hotel Management System/
├── index.html              # Login page (Customer & Admin)
├── register.html           # User registration page
├── dashboard.html          # Customer dashboard
├── admin-dashboard.html    # Admin dashboard
├── reservation.html        # Customer reservation page
├── admin-reservation.html  # Admin reservation management
├── billing.html           # Customer billing page
├── admin-billing.html     # Admin billing & invoicing
├── payment.html           # Payment processing page
├── history.html           # Customer booking history
├── admin-history.html     # Admin booking history management
├── bookings.html          # Customer upcoming bookings
├── admin-bookings.html    # Admin all bookings management
├── room-status.html       # Admin room status management
├── support.html           # Customer support page
├── css/
│   └── styles.css         # Custom styles and theming
├── js/
│   └── script.js          # Main JavaScript functionality
└── README.md              # Project documentation
```

## 🚀 How to Run

1. **Clone or Download** the project files to your local machine
2. **Open** the `index.html` file in your preferred web browser
3. **No installation required** - Everything runs client-side

## 🔐 Default Credentials

### Admin Login
- **Username**: `Admin`
- **Password**: `Admin@123`

### Customer Registration
- New users can register using the registration page
- All fields are validated with specific requirements
- Auto-generated User ID is provided upon successful registration

## ✅ Validation Features

### Registration Validation
- **Name**: 1-50 characters required
- **Email**: Valid email format required
- **Mobile**: 10-digit number with country code
- **Customer ID**: 5-20 characters, unique validation
- **Password**: Must contain uppercase, lowercase, and special character
- **Confirm Password**: Must match password

### Login Validation
- **User ID/Username/Email**: 5-50 characters required (accepts User ID, Username, or Email)
- **Password**: Same validation rules as registration
- **Multiple Login Options**: Users can login using User ID, Username, or Email ID
- **Error Messages**: Specific error messages for invalid inputs

### Payment Validation
- **Card Number**: Exactly 16 digits
- **Card Holder Name**: Minimum 10 characters
- **Expiry Date**: MM/YY format
- **CVV**: Exactly 3 digits

## 💾 Data Storage

The system uses browser-based storage:
- **LocalStorage**: Persistent data (users, reservations, bookings, payments)
- **SessionStorage**: Temporary session data (current user, role)
- **No Backend**: All data is stored locally in the browser

## 📱 Responsive Design

- **Mobile First**: Optimized for all screen sizes
- **Bootstrap Grid**: Responsive layout system
- **Touch Friendly**: Large buttons and touch targets
- **Cross Browser**: Compatible with all modern browsers

## 🔧 Key Functionalities

### User Management
- Customer registration with validation
- Role-based authentication (Customer/Admin)
- Session management
- Profile information display

### Reservation System
- Date selection with validation
- Room type preferences
- Real-time availability checking
- Booking ID generation

### Billing & Payment
- Detailed bill breakdown
- GST calculation
- Multiple payment modes
- Secure card processing simulation
- Transaction ID generation

### Room Management
- Real-time status tracking
- Floor-wise organization
- Color-coded availability
- Price management

### Support System
- Multiple complaint categories
- Priority levels
- Auto-generated complaint IDs
- 24/7 contact information

## 🎯 User Stories Implemented

### Registration
- ✅ Customer self-registration with all required fields
- ✅ Input validation with error messages
- ✅ Success message with generated User ID

### Login
- ✅ Separate login for customers and admin
- ✅ Specific error messages for invalid inputs
- ✅ Role-based dashboard redirection

### Dashboard
- ✅ Customer dashboard with personalized menu
- ✅ Admin dashboard with management features
- ✅ Welcome message with username

### Reservation
- ✅ Customer reservation form with date validation
- ✅ Admin reservation approval/rejection system
- ✅ Booking ID generation

### Billing
- ✅ Customer bill viewing with detailed breakdown
- ✅ Admin invoice generation by User ID
- ✅ Payment processing integration

### History
- ✅ Customer booking history with filtering
- ✅ Admin user-specific history viewing
- ✅ Complete booking details display

### Room Status
- ✅ Admin room availability by Customer ID
- ✅ Color-coded vacancy status
- ✅ Floor-wise room organization

### Bookings
- ✅ Customer upcoming bookings management
- ✅ Admin comprehensive booking control
- ✅ Real-time status updates

### Support
- ✅ Complete contact information display
- ✅ Feedback and complaint forms
- ✅ Quick action buttons for common requests

## 🌟 Special Features

### Notification System
- Thank you popup after checkout
- Direct link to support page
- Transaction confirmation messages

### Security Features
- Input sanitization
- Password complexity requirements
- Session-based authentication
- Data validation

### User Experience
- Intuitive navigation
- Clear error messages
- Success confirmations
- Loading indicators
- Responsive design

## 🔄 Data Flow

1. **Registration**: User data → LocalStorage → Success message
2. **Login**: Validation → SessionStorage → Dashboard redirect
3. **Reservation**: Form data → LocalStorage → Booking ID
4. **Payment**: Card validation → Transaction record → Success popup
5. **Support**: Form submission → Complaint ID → Confirmation

## 🐛 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 📝 Notes

- This is a front-end only application
- All data is stored locally in the browser
- No actual payment processing occurs
- Email notifications are simulated
- Some data is randomly generated for demonstration

## 🤝 Contributing

Feel free to suggest improvements or report issues. This project serves as a comprehensive example of a modern web application built with fundamental web technologies.

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

---

**Grand Hotel Management System** - A complete front-end solution for hotel management needs.
