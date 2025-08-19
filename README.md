# L-overCook 🍳

A comprehensive recipe management and sharing platform that allows users to discover, save, and review culinary recipes from around the world.

## Description

L-overCook is a full-stack web application designed for food enthusiasts who want to explore diverse cuisines, manage their favorite recipes, and share their culinary experiences. The platform features a user-friendly interface for browsing recipes by categories, cuisines, and ingredients, along with comprehensive admin tools for content management.

## Tech Stack

### Frontend

- **Template Engine**: EJS (Embedded JavaScript)
- **Styling**: CSS3
- **JavaScript**: Vanilla JavaScript
- **Layout Engine**: Express EJS Layouts

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: Passport.js with Local Strategy
- **Session Management**: Express Session with MongoDB Store
- **Password Hashing**: Bcrypt
- **File Upload**: Multer
- **Email Service**: Nodemailer

### Database

- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Session Store**: MongoDB Session Store

### Development & Utilities

- **Environment Variables**: Dotenv
- **Development Server**: Nodemon
- **String Manipulation**: Slugify, Shortid, UUID
- **Search**: FuzzySearch

## Features

### User Features

- 🔐 **User Authentication**: Secure signup/signin with email verification
- 👤 **User Profiles**: Personal profile management with avatar upload
- 🔍 **Recipe Search**: Advanced search functionality with search history
- ❤️ **Favorites**: Save and manage favorite recipes
- ⭐ **Reviews & Ratings**: Rate and review recipes
- 🌍 **Cuisine Exploration**: Browse recipes by different cuisines
- 🥗 **Ingredient-based Search**: Find recipes by available ingredients

### Admin Features

- 📊 **Dashboard**: Comprehensive admin dashboard with statistics
- 👥 **User Management**: Manage user accounts and permissions
- 🍽️ **Recipe Management**: Add, edit, and delete recipes
- 🥘 **Cuisine Management**: Manage cuisine categories
- 🥕 **Ingredient Management**: Organize ingredients by categories
- 📁 **Category Management**: Create and manage ingredient categories

### Technical Features

- 📱 **Responsive Design**: Mobile-friendly interface
- 🔒 **Secure Sessions**: Session-based authentication
- 📧 **Email Integration**: Account verification and notifications
- 🖼️ **Image Upload**: Recipe and profile image management
- 🔗 **SEO-friendly URLs**: Slugified recipe URLs

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **MongoDB Atlas Account** (or local MongoDB installation)
- **Git** (for cloning the repository)

### Required Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `SESSION_SECRET` - Secret key for session encryption
- `EMAIL_HOST` - SMTP host for email service
- `EMAIL_PORT` - SMTP port for email service
- `EMAIL_USER` - Email username for authentication
- `EMAIL_PASS` - Email password for authentication

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/L-overCook.git
   cd L-overCook
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   Create a `.env` file in the root directory and add the following:

   ```env
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret_key
   EMAIL_HOST=your_smtp_host
   EMAIL_PORT=your_smtp_port
   EMAIL_USER=your_email_username
   EMAIL_PASS=your_email_password
   PORT=3000
   ```

4. **Seed the database (optional)**

   If you want to populate the database with sample data:

   ```bash
   node models/seed/sampleSeed.js
   ```

5. **Run the application**

   For development:

   ```bash
   npm test
   ```

   For production:

   ```bash
   npm start
   ```

6. **Access the application**

   Open your browser and navigate to `http://localhost:3000`

## Usage

### For Regular Users

1. **Sign Up/Sign In**: Create an account or log in to access personalized features
2. **Browse Recipes**: Explore recipes by cuisine, category, or search functionality
3. **Save Favorites**: Click the heart icon to save recipes to your favorites
4. **Rate & Review**: Share your experience by rating and reviewing recipes
5. **Profile Management**: Update your profile information and avatar

### For Administrators

1. **Admin Access**: Log in with admin credentials to access the admin panel
2. **Dashboard**: View statistics and system overview at `/dashboard`
3. **Manage Content**: Add, edit, or remove recipes, cuisines, ingredients, and categories
4. **User Management**: Monitor and manage user accounts

## Folder Structure

```
L-overCook/
├── controllers/                 # Request handlers
│   ├── admin/                  # Admin-specific controllers
│   │   ├── categoryController.js
│   │   ├── cuisineController.js
│   │   ├── ingredientController.js
│   │   ├── recipeController.js
│   │   └── usersController.js
│   ├── client/                 # Client-specific controllers
│   │   ├── favoriteRecipeController.js
│   │   ├── homeController.js
│   │   ├── profileController.js
│   │   ├── reviewController.js
│   │   └── searchHistoryController.js
│   ├── sendEmail.js           # Email service controller
│   ├── signInController.js    # Authentication controller
│   └── SignUpController.js    # Registration controller
├── middlewares/                # Custom middleware functions
│   ├── checkAdmin.js          # Admin authorization middleware
│   ├── checkVerifyOTP.js      # OTP verification middleware
│   ├── database.js            # Database connection
│   ├── PassportConfig.js      # Passport authentication config
│   └── UploadMedia.js         # File upload middleware
├── models/                     # Database models
│   ├── Category.js            # Ingredient categories
│   ├── Cuisine.js             # Cuisine types
│   ├── Ingredient.js          # Recipe ingredients
│   ├── Recipe.js              # Recipe model with reviews
│   ├── User.js                # User accounts
│   └── seed/                  # Database seeding files
├── public/                     # Static assets
│   ├── css/                   # Stylesheets
│   ├── js/                    # Client-side JavaScript
│   ├── images/                # Static images
│   └── uploadImages/          # User-uploaded images
├── routes/                     # Route definitions
│   ├── admin/                 # Admin routes
│   ├── client/                # Client routes
│   ├── partials/              # Shared routes
│   └── index.js               # Route aggregator
├── views/                      # EJS templates
│   ├── admin/                 # Admin interface templates
│   ├── client/                # Client interface templates
│   ├── layouts/               # Layout templates
│   └── partials/              # Reusable template components
├── server.js                   # Main application entry point
├── session.js                  # Session configuration
└── package.json               # Dependencies and scripts
```

## Contributing

We welcome contributions to L-overCook! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m "Add your commit message"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**

### Contribution Guidelines

- Follow the existing code style and structure
- Add comments for complex functionality
- Test your changes thoroughly
- Update documentation if necessary

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Contact

**Project Maintainer**: LJFamily2  
**GitHub**: [https://github.com/LJFamily2](https://github.com/LJFamily2)  
**Repository**: [https://github.com/LJFamily2/L-overCook](https://github.com/LJFamily2/L-overCook)

---

### 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/LJFamily2/L-overCook.git
cd L-overCook
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configurations

# Run the application
npm test  # Development mode
npm start # Production mode
```

**Happy Cooking! 👨‍🍳👩‍🍳**
