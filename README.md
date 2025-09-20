# Glyptic Website - Dynamic Content Management System

A complete dynamic content management system for Glyptic website with admin panel for managing services and solutions.

## Features

- **Admin Panel**: React-based admin interface for content management
- **Dynamic Content**: Rich text editor with image upload support
- **Services Management**: Create, edit, delete services with dynamic content blocks
- **Solutions Management**: Create, edit, delete solutions with dynamic content blocks
- **MongoDB Integration**: Data persistence with MongoDB
- **File Upload**: Image upload functionality with multer
- **Responsive Design**: Mobile-friendly admin interface

## Project Structure

```
Glyptic website/
├── admin/                 # React admin panel
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app component
├── backend/               # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── uploads/          # File uploads directory
├── assets/               # Frontend assets
│   └── js/
│       └── dynamic-content.js  # Frontend integration script
├── service.html          # Services page (updated with dynamic loading)
├── solution.html         # Solutions page (updated with dynamic loading)
└── README.md
```

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Start Backend

Make sure MongoDB is running on your system, then start the backend:

```bash
npm run dev
```

The backend will run on `http://localhost:5000` and show:
- ✅ MongoDB connection status
- 🚀 Server startup confirmation
- 🌐 Admin panel URL
- 🔧 API base URL

### 3. Admin Panel Setup

```bash
cd admin
npm install
npm run dev
```

The admin panel will run on `http://localhost:5173`

### 4. MongoDB Setup

Make sure MongoDB is installed and running. The application will create the following collections:
- `services` - For storing service data
- `solutions` - For storing solution data

### 5. New Features Added

- **🎨 Modern Glyptic-themed Design**: Glassmorphism effects, gradients, and smooth animations
- **📱 Responsive Dashboard**: Overview of content statistics and quick actions
- **🖼️ Image Upload & Preview**: Real-time image upload with instant preview
- **✨ Enhanced UI/UX**: Better loading states, icons, and visual feedback
- **🔧 Improved Backend**: Better error handling and connection status messages

## Usage

### Admin Panel

1. Navigate to `http://localhost:5173`
2. **Dashboard**: View content statistics and quick actions
3. **Navigation**: Switch between Dashboard, Services, and Solutions
4. **Create Content**: Click "Add New Service/Solution" to create content
5. **Content Builder**: Add dynamic content blocks:
   - **Titles**: Section headings with custom styling
   - **Images**: Upload images with instant preview (supports JPG, PNG, GIF, WebP)
   - **Rich Text**: Formatted content with bold, italic, underline, headers, lists
6. **Real-time Preview**: See images immediately after upload
7. **Content Management**: Reorder, edit, or remove content blocks easily

### Content Management

Each service/solution can contain multiple content blocks in any order:
- Add titles for section headings
- Upload images for visual content
- Add rich text content with formatting
- Reorder content blocks using up/down arrows
- Remove unwanted content blocks

### Frontend Integration

The frontend pages (`service.html` and `solution.html`) automatically load content from the backend API and display it in the existing tab structure.

## API Endpoints

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Solutions
- `GET /api/solutions` - Get all solutions
- `GET /api/solutions/:id` - Get solution by ID
- `POST /api/solutions` - Create new solution
- `PUT /api/solutions/:id` - Update solution
- `DELETE /api/solutions/:id` - Delete solution

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Admin Panel**: React, React Router, React Quill (Rich Text Editor)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **File Upload**: Multer
- **Styling**: Custom CSS with responsive design

## Content Structure

Each service/solution contains:
- `title`: Main title
- `contents`: Array of content blocks with:
  - `type`: 'title', 'image', or 'content'
  - `data`: The actual content (text, image filename, or HTML)
  - `order`: Display order

## Development Notes

- The system maintains the existing website design and structure
- Dynamic content replaces static tab content
- File uploads are stored in `backend/uploads/`
- Rich text editor supports HTML formatting
- Content is automatically ordered and can be reordered in the admin panel

## Future Enhancements

- User authentication for admin panel
- Content versioning
- SEO optimization fields
- Content scheduling
- Multi-language support
- Advanced image management