# 🔍 Gotcha - Lost & Found Community Platform

A modern, full-stack web application designed to help people reunite with their lost belongings through community collaboration. Built with React, Node.js, and MongoDB.

![Gotcha Logo](./public/gotcha-logo-new.png)

## 🌟 Features

### 🔐 **Authentication System**
- User registration with email verification
- Secure login/logout functionality
- Admin panel for user management
- JWT-based authentication
- Password reset functionality

### 📍 **Lost & Found Management**
- **Report Lost Items**: Post detailed descriptions with photos and location
- **Report Found Items**: Help others by posting items you've discovered
- **Smart Search**: Filter by category, location, date, and keywords
- **Status Tracking**: Monitor the progress of your reports
- **Location Integration**: Map-based location selection and display

### 🔔 **Notification System**
- Real-time in-app notifications
- Email notifications for registration
- Match alerts when similar items are posted
- Notification management (mark as read, delete)

### 📊 **User Dashboard**
- Personal history with statistics
- Item management (edit, delete, mark as found)
- Profile management
- Activity tracking and analytics

### 🎨 **Modern Design**
- Responsive design for all devices
- Dark/Light mode toggle
- Professional UI with Tailwind CSS
- Interactive maps with Leaflet
- Mobile-first approach

## 🚀 Technology Stack

### **Frontend**
- **React 18.2.0** - Modern UI library
- **Vite 7.1.2** - Fast build tool and dev server
- **React Router 6.23.1** - Client-side routing
- **Tailwind CSS 3.3.3** - Utility-first CSS framework
- **Leaflet** - Interactive maps
- **EmailJS** - Client-side email service

### **Backend**
- **Node.js** - JavaScript runtime
- **Express 5.1.0** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 8.17.1** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Nodemailer** - Email service
- **bcrypt** - Password hashing

### **Database**
- **MongoDB Atlas** - Cloud database service
- **Collections**: Users, Items, Notifications

## 📦 Installation & Setup

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Gmail account for email service

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/gotcha-app.git
cd gotcha-app
```

### **2. Backend Setup**
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
# Database
MONGO_URI=your_mongodb_atlas_connection_string

# Server
PORT=5000

# JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_key

# Email Configuration
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### **3. Frontend Setup**
```bash
cd ../
npm install
```

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_USER_ID=your_emailjs_user_id
```

### **4. Database Setup**
Create an admin user:
```bash
cd backend
node createAdmin.js
```

Add test data (optional):
```bash
node createTestItems.js
node createTestNotifications.js
```

## 🏃‍♂️ Running the Application

### **Development Mode**

**Start Backend Server:**
```bash
cd backend
node app.js
```
Server runs on: `http://localhost:5000`

**Start Frontend Server:**
```bash
cd ../
npm run dev
```
Frontend runs on: `http://localhost:5173`

### **Production Build**
```bash
npm run build
```

## 📧 Email Service Setup

### **Gmail Configuration**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. Update `EMAIL_PASS` in `.env` with the 16-character app password

### **Email Features**
- Welcome emails on user registration
- Professional HTML templates with branding
- Mobile-responsive email design
- Error handling and fallback mechanisms

## 🗄️ Database Schema

### **Users Collection**
```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  username: String (required),
  password: String (hashed),
  isAdmin: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### **Items Collection**
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  category: String (required),
  type: String (lost/found),
  location: String,
  latitude: Number,
  longitude: Number,
  imageUrl: String,
  status: String (active/claimed/expired),
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### **Notifications Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String (required),
  message: String (required),
  type: String (info/success/warning/error),
  isRead: Boolean (default: false),
  createdAt: Date
}
```

## 🛠️ API Endpoints

### **Authentication**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile
- `POST /api/auth/reset-password` - Reset password

### **Items**
- `GET /api/items` - Get all items (with filters)
- `POST /api/items` - Create new item
- `GET /api/items/my` - Get user's items
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### **Notifications**
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

## 🔧 Configuration Files

### **Tailwind CSS** (`tailwind.config.js`)
```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#14b8a6',
        secondary: '#f97316'
      }
    }
  }
}
```

### **Vite** (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

## 🚀 Deployment

### **Frontend (Vercel)**
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds on git push

### **Backend (Railway)**
1. Connect repository to Railway
2. Set environment variables
3. Deploy with `railway.toml` configuration

### **Database**
- Use MongoDB Atlas for production
- Configure connection string with proper authentication
- Set up database backups and monitoring

## 🧪 Testing

### **Test Accounts**
- **Admin**: `gotchaofficial101@gmail.com` / `got@101cha`
- **Regular User**: Create through registration

### **Test Data**
Run the provided scripts to populate with sample data:
```bash
node backend/createTestItems.js
node backend/createTestNotifications.js
```

## 📱 Mobile Support

- Fully responsive design
- Touch-friendly interface
- Optimized for mobile performance
- Progressive Web App (PWA) ready

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Input validation and sanitization
- Protected API routes
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: gotchaofficial101@gmail.com
- Create an issue in the repository

## 🎯 Future Enhancements

- [ ] Real-time chat between users
- [ ] Push notifications
- [ ] Advanced image recognition
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Social media integration
- [ ] Advanced analytics dashboard
- [ ] API rate limiting
- [ ] Advanced search with AI

## 🏆 Acknowledgments

- **MongoDB Atlas** for database hosting
- **Vercel** for frontend deployment
- **Railway** for backend hosting
- **Tailwind CSS** for the amazing utility framework
- **React** team for the excellent frontend library
- **Node.js** community for the robust backend platform

---

**Built with ❤️ by the Gotcha Team**

*Connecting lost items with their owners, one find at a time.* 🤝
