# Scholaria - Academic Communication Platform

## Introduction

Scholaria is a modern web application designed to improve communication between lecturers and students in educational institutions. It provides a centralized platform where lecturers can share course materials, make announcements, and manage their courses, while students can easily access learning resources and stay updated with important information.

# KINDLY NOTE THAT YOU ARE TO LOGIN/REGISTER AS BOTH LECTURER AND STUDENT TO SEE HOW THE APP. WORKS - 
{
   **SAMPLE CREDENTIALS**
   FOR LECTURER, USE - 
   adam@gmail.com or sadat@gmail.com
   adam123

   FOR STUDENT, USE -
   basit@gmail.com
   adam123
}

## Problem Statement

Traditional academic communication often relies on scattered methods like email, physical handouts, or basic learning management systems that can be difficult to navigate. This leads to:
- Students missing important announcements and deadlines
- Lecturers struggling to organize and distribute course materials efficiently
- Poor communication flow between educators and learners
- Difficulty in tracking student engagement and course progress

Scholaria solves these problems by providing a user-friendly, organized platform that streamlines academic communication.

## Main Features

### For Lecturers
- **Course Management**: Create and manage multiple courses with detailed information
- **Announcements**: Post important updates and announcements to students
- **Material Sharing**: Upload and organize course materials by categories (lecture notes, assignments, readings, etc.)
- **Student Tracking**: Monitor student enrollment and engagement
- **File Management**: Support for various file types (PDF, documents, images, videos, audio)

### For Students
- **Course Discovery**: Browse and enroll in available courses
- **Real-time Updates**: Receive notifications about new announcements and materials
- **Organized Resources**: Access course materials organized by categories
- **File Preview**: Preview files directly in the browser before downloading
- **Easy Navigation**: User-friendly interface for accessing course content

### General Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Instant notifications and updates
- **File Support**: Multiple file format support with preview capabilities
- **Search Functionality**: Quick search through courses, announcements, and materials
- **User Authentication**: Secure login and registration system
- **Role-based Access**: Different interfaces for lecturers and students

# KINDLY NOTE THAT YOU ARE TO LOGIN/REGISTER AS BOTH LECTURER AND STUDENT TO SEE HOW THE APP. WORKS - 
{
   **SAMPLE CREDENTIALS**
   FOR LECTURER, USE - 
   adam@gmail.com or sadat@gmail.com
   adam123

   FOR STUDENT, USE -
   basit@gmail.com
   adam123
}


## How to Use Scholaria

### Getting Started

1. **Visit the Website**: Open your web browser and go to the Scholaria website
2. **Create an Account**: Click "Register" and fill in your details
3. **Choose Your Role**: Select whether you're a "Student" or "Lecturer"
4. **Log In**: Use your email and password to access your account

### For Lecturers

#### Creating a Course
1. Log in to your lecturer account
2. Click "Create Course" on the courses page
3. Fill in the course details:
   - Course title (e.g., "Introduction to Computer Science")
   - Course code (e.g., "CS101")
   - Description of the course
4. Click "Create Course" to save

#### Making Announcements
1. Go to the "Announcements" section
2. Click "New Announcement"
3. Select the course you want to make an announcement for
4. Write your announcement title and content
5. Check "Mark as important" if it's urgent
6. Click "Create Announcement"

#### Uploading Materials
1. Navigate to the "Materials" section
2. Click "Upload Material"
3. Select the course and category (lecture notes, assignments, etc.)
4. Add a title and description
5. Choose your file to upload
6. Click "Upload Material"

#### Managing Your Courses
- View course details by clicking "View Details" on any course
- Edit course information using the "Edit Course" button
- Monitor student enrollment in the course dashboard

### For Students

#### Finding and Enrolling in Courses
1. Browse available courses on the main courses page
2. Use the search bar to find specific courses
3. Click "View Details" to see course information
4. Click "Enroll" to join the course

#### Accessing Course Content
1. Go to "My Courses" to see enrolled courses
2. Click on any course to view its details
3. Check the "Announcements" tab for updates from your lecturer
4. Browse "Materials" to access learning resources

#### Using Course Materials
1. Click on any material to preview it
2. Use the "Download" button to save files to your device
3. Click "Open in New Tab" to view files in full screen
4. Materials are organized by categories for easy navigation

### Navigation Tips

- **Dashboard**: Your main overview page with quick stats and recent activity
- **Courses**: Browse and manage courses (lecturers) or enroll in courses (students)
- **Announcements**: View and create announcements
- **Materials**: Access and upload course materials
- **Profile**: Update your account information and settings


# KINDLY NOTE THAT YOU ARE TO LOGIN/REGISTER AS BOTH LECTURER AND STUDENT TO SEE HOW THE APP. WORKS - 
{
   **SAMPLE CREDENTIALS**
   FOR LECTURER, USE - 
   adam@gmail.com or sadat@gmail.com
   adam123

   FOR STUDENT, USE -
   basit@gmail.com
   adam123
}

## Technical Details

### Frontend Technologies
- **Next.js 15**: React framework for building the user interface
- **React**: JavaScript library for creating interactive user interfaces
- **TypeScript**: Type-safe JavaScript for better code quality
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth user interactions
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation for form data
- **React Query**: Data fetching and state management
- **Lucide React**: Icon library for consistent UI elements

### Backend Technologies
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for storing application data
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for user authentication
- **Multer**: File upload handling
- **Bcryptjs**: Password hashing for security
- **Express Validator**: Input validation middleware

### Development Tools
- **Vite**: Fast build tool and development server
- **ESLint**: Code linting for quality assurance
- **Prettier**: Code formatting for consistency
- **Git**: Version control system

### Deployment
- **Vercel**: Frontend and backend hosting platform
- **MongoDB Atlas**: Cloud database hosting

## Installation and Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager
- MongoDB database (local or cloud)

# KINDLY NOTE THAT YOU ARE TO LOGIN/REGISTER AS BOTH LECTURER AND STUDENT TO SEE HOW THE APP. WORKS - 
{
   **SAMPLE CREDENTIALS**
   FOR LECTURER, USE - 
   adam@gmail.com or sadat@gmail.com
   adam123

   FOR STUDENT, USE -
   basit@gmail.com
   adam123
}


### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

#### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

# KINDLY NOTE THAT YOU ARE TO LOGIN/REGISTER AS BOTH LECTURER AND STUDENT TO SEE HOW THE APP. WORKS - 
{
   **SAMPLE CREDENTIALS**
   FOR LECTURER, USE - 
   adam@gmail.com or sadat@gmail.com
   adam123

   FOR STUDENT, USE -
   basit@gmail.com
   adam123
}


# Preview of the App Interface 
![screenshots](/frontend/public/screenshots/screencapture-scholaria-vercel-app-2025-08-03-18_49_00.png)
Landing Page of the App


![screenshots](/frontend/public/screenshots/screencapture-scholaria-vercel-app-register-2025-08-03-18_49_19.png)
Register Page

![screenshots](/frontend/public/screenshots/screencapture-scholaria-vercel-app-login-2025-08-03-18_49_13.png)
Login Page

![screenshots](/frontend/public/screenshots/screencapture-scholaria-vercel-app-dashboard-2025-08-03-18_49_33.png)
Lecturer  Dashboard

![screenshots](/frontend/public/screenshots/screencapture-scholaria-vercel-app-dashboard-2025-08-03-18_50_38.png)

Student Dashboard
![screenshots](/frontend/public/screenshots/screencapture-scholaria-vercel-app-courses-2025-08-03-18_49_41.png)
Courses list for the lecturer

![screenshots](/frontend/public/screenshots/screencapture-scholaria-vercel-app-courses-2025-08-03-18_50_52.png)
Courses list for student
![screenshots](/frontend/public/screenshots/screencapture-scholaria-vercel-app-courses-create-2025-08-03-18_49_49%20(1).png)
Create course page

![screenshots](/frontend/public/screenshots/screencapture-scholaria-vercel-app-announcements-2025-08-03-18_49_56.png)
Announcement page (for lecturers) where they can post, edit/comment or delete the announcements
![screenshots](/frontend/public/screenshots/screencapture-scholaria-vercel-app-announcements-2025-08-03-18_50_59.png)
Announcement apge for the students, where they can view and also drop comments

![screenshots](/frontend/public/screenshots/screencapture-scholaria-vercel-app-materials-2025-08-03-18_50_04.png)
Course material page for the lecturer (he can upload., view and even download or edit the materials)


![screenshots](/frontend/public/screenshots/screencapture-scholaria-vercel-app-profile-2025-08-03-18_50_15.png)
Profile page for the lecturer
![screenshots](/frontend/public/screenshots/screencapture-scholaria-vercel-app-profile-2025-08-03-18_51_15.png)
Profile page for the student


## Contributing

We welcome contributions to improve Scholaria! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

If you encounter any issues or have questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors who helped build Scholaria
- Special thanks to the educational community for feedback and suggestions
- Built with modern web technologies for the best user experience 