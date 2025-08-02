# Scholaria Backend API

A complete, scalable Node.js + Express backend for Scholaria, an academic communication tool that allows lecturers to post announcements and share course materials with students.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Course Management**: Create, manage, and enroll in courses
- **Announcements**: Post and manage course announcements
- **File Upload**: Upload and manage course materials (PDF, DOC, images)
- **Comments**: Students can comment on announcements
- **Security**: Helmet, CORS, input validation, and error handling
- **Scalable Architecture**: MVC pattern with proper separation of concerns

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scholaria-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/scholaria
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   MAX_FILE_SIZE=10485760
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // or "lecturer"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Courses

#### Create Course (Lecturer Only)
```http
POST /courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Introduction to Computer Science",
  "code": "CS101",
  "description": "Basic concepts of programming and computer science"
}
```

#### Get All Courses
```http
GET /courses?page=1&limit=10&search=computer
Authorization: Bearer <token>
```

#### Get Single Course
```http
GET /courses/:id
Authorization: Bearer <token>
```

#### Update Course (Lecturer Only)
```http
PUT /courses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Course Title",
  "code": "CS101",
  "description": "Updated description"
}
```

#### Delete Course (Lecturer Only)
```http
DELETE /courses/:id
Authorization: Bearer <token>
```

#### Enroll in Course (Students Only)
```http
POST /courses/:id/enroll
Authorization: Bearer <token>
```

### Announcements

#### Create Announcement (Lecturer Only)
```http
POST /announcements
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Important Announcement",
  "body": "This is an important announcement for all students.",
  "courseId": "course_id_here",
  "isImportant": true
}
```

#### Get Announcements by Course
```http
GET /announcements/:courseId?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Single Announcement
```http
GET /announcements/detail/:id
Authorization: Bearer <token>
```

#### Update Announcement (Lecturer Only)
```http
PUT /announcements/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Announcement",
  "body": "Updated content",
  "isImportant": false
}
```

#### Delete Announcement (Lecturer Only)
```http
DELETE /announcements/:id
Authorization: Bearer <token>
```

### Materials

#### Upload Material (Lecturer Only)
```http
POST /materials/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "file": <file>,
  "title": "Lecture Notes",
  "description": "Week 1 lecture notes",
  "courseId": "course_id_here",
  "category": "lecture"
}
```

#### Get Materials by Course
```http
GET /materials/:courseId?page=1&limit=10&category=lecture
Authorization: Bearer <token>
```

#### Get Single Material
```http
GET /materials/detail/:id
Authorization: Bearer <token>
```

#### Update Material (Lecturer Only)
```http
PUT /materials/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Material Title",
  "description": "Updated description",
  "category": "assignment"
}
```

#### Delete Material (Lecturer Only)
```http
DELETE /materials/:id
Authorization: Bearer <token>
```

#### Download Material
```http
GET /materials/download/:id
Authorization: Bearer <token>
```

### Comments

#### Add Comment
```http
POST /comments/:announcementId
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is a comment on the announcement"
}
```

#### Get Comments for Announcement
```http
GET /comments/:announcementId?page=1&limit=10
Authorization: Bearer <token>
```

#### Update Comment
```http
PUT /comments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated comment content"
}
```

#### Delete Comment
```http
DELETE /comments/:id
Authorization: Bearer <token>
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📁 File Upload

Supported file types:
- PDF files
- Word documents (DOC, DOCX)
- Images (JPEG, PNG, GIF)
- Text files

Maximum file size: 10MB (configurable)

## 🏗️ Project Structure

```
scholaria-backend/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── courseController.js
│   ├── announcementController.js
│   ├── materialController.js
│   └── commentController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── validate.js
│   └── upload.js
├── models/
│   ├── User.js
│   ├── Course.js
│   ├── Announcement.js
│   ├── Material.js
│   └── Comment.js
├── routes/
│   ├── auth.js
│   ├── courses.js
│   ├── announcements.js
│   ├── materials.js
│   └── comments.js
├── utils/
│   └── responseHandler.js
├── uploads/
├── server.js
├── package.json
└── README.md
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/scholaria
JWT_SECRET=your-super-secure-production-secret
JWT_EXPIRE=30d
MAX_FILE_SIZE=10485760
CORS_ORIGIN=https://your-frontend-domain.com
```

### Deployment Platforms

- **Heroku**: Add MongoDB addon and set environment variables
- **Vercel**: Configure MongoDB connection and environment variables
- **Railway**: Use Railway's MongoDB service
- **DigitalOcean**: Deploy to App Platform with MongoDB managed database

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```

### Health Check
```http
GET /api/v1/health
```

### Error Handling

The API uses a centralized error handling middleware that:
- Catches and formats all errors
- Provides meaningful error messages
- Includes stack traces in development mode
- Handles MongoDB validation errors
- Manages JWT authentication errors

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository. 