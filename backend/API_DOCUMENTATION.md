# Scholaria API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Error Handling](#error-handling)
5. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Courses](#courses-endpoints)
   - [Announcements](#announcements-endpoints)
   - [Materials](#materials-endpoints)
   - [Comments](#comments-endpoints)
6. [Data Models](#data-models)
7. [File Upload](#file-upload)
8. [Rate Limiting](#rate-limiting)
9. [Examples](#examples)

## Overview

The Scholaria API is a RESTful service that provides endpoints for managing academic courses, announcements, materials, and user interactions. The API follows REST principles and uses JSON for data exchange.

**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api/v1`  
**Content-Type:** `application/json`

## Base URL

All API endpoints are prefixed with `/api/v1`. For development, the base URL is:
```
http://localhost:5000/api/v1
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require authentication.

### Getting a Token

1. **Register** a new account or **Login** with existing credentials
2. The response includes a `token` field
3. Include this token in subsequent requests

### Using the Token

Include the token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

**Example:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     http://localhost:5000/api/v1/auth/me
```

## Error Handling

The API uses standard HTTP status codes and returns error responses in a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "enrolledCourses": [],
    "createdCourses": [],
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register response

#### Get Current User
```http
GET /auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "enrolledCourses": [],
    "createdCourses": [],
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Courses Endpoints

#### Create Course (Lecturer Only)
```http
POST /courses
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Introduction to Computer Science",
  "code": "CS101",
  "description": "Basic concepts of programming and computer science"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "title": "Introduction to Computer Science",
    "code": "CS101",
    "description": "Basic concepts of programming and computer science",
    "lecturer": "60f7b3b3b3b3b3b3b3b3b3b3",
    "students": [],
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get All Courses
```http
GET /courses?page=1&limit=10&search=computer
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "title": "Introduction to Computer Science",
      "code": "CS101",
      "description": "Basic concepts of programming and computer science",
      "lecturer": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "Dr. Smith",
        "email": "smith@university.edu"
      },
      "students": [],
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Get Course by ID
```http
GET /courses/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** Same as create course response

#### Update Course (Lecturer Only)
```http
PUT /courses/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Advanced Computer Science",
  "description": "Advanced programming concepts",
  "isActive": true
}
```

**Response:** Same as create course response

#### Delete Course (Lecturer Only)
```http
DELETE /courses/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

#### Enroll in Course (Student Only)
```http
POST /courses/{id}/enroll
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Successfully enrolled in course"
}
```

### Announcements Endpoints

#### Create Announcement (Lecturer Only)
```http
POST /announcements
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Midterm Exam Schedule",
  "body": "The midterm exam will be held on Friday at 2 PM in Room 101.",
  "course": "60f7b3b3b3b3b3b3b3b3b3b4",
  "isImportant": true,
  "attachments": ["attachment1.pdf", "attachment2.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
    "title": "Midterm Exam Schedule",
    "body": "The midterm exam will be held on Friday at 2 PM in Room 101.",
    "course": "60f7b3b3b3b3b3b3b3b3b4",
    "createdBy": "60f7b3b3b3b3b3b3b3b3b3b3",
    "isImportant": true,
    "attachments": ["attachment1.pdf", "attachment2.jpg"],
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get Announcements by Course
```http
GET /announcements/{courseId}?page=1&limit=10
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "title": "Midterm Exam Schedule",
      "body": "The midterm exam will be held on Friday at 2 PM in Room 101.",
      "course": {
        "_id": "60f7b3b3b3b3b3b3b3b3b4",
        "title": "Introduction to Computer Science",
        "code": "CS101"
      },
      "createdBy": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3",
        "name": "Dr. Smith"
      },
      "isImportant": true,
      "attachments": ["attachment1.pdf", "attachment2.jpg"],
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Get Announcement by ID
```http
GET /announcements/detail/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** Same as create announcement response

#### Update Announcement (Lecturer Only)
```http
PUT /announcements/detail/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated Midterm Exam Schedule",
  "body": "The midterm exam has been rescheduled to Monday at 3 PM.",
  "isImportant": false
}
```

**Response:** Same as create announcement response

#### Delete Announcement (Lecturer Only)
```http
DELETE /announcements/detail/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Announcement deleted successfully"
}
```

### Materials Endpoints

#### Upload Material (Lecturer Only)
```http
POST /materials/upload
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:** `multipart/form-data`
- `title`: Material title
- `description`: Material description
- `course`: Course ID
- `category`: Material category
- `isPublic`: Boolean
- `file`: File to upload

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b6",
    "title": "Lecture Notes - Week 1",
    "description": "Introduction to programming concepts",
    "fileUrl": "/uploads/lecture_notes_week1.pdf",
    "fileName": "lecture_notes_week1.pdf",
    "fileType": "application/pdf",
    "fileSize": 1024000,
    "course": "60f7b3b3b3b3b3b3b3b3b4",
    "uploadedBy": "60f7b3b3b3b3b3b3b3b3b3",
    "category": "lecture_notes",
    "isPublic": true,
    "uploadedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get Materials by Course
```http
GET /materials/{courseId}?page=1&limit=10&category=lecture_notes
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b6",
      "title": "Lecture Notes - Week 1",
      "description": "Introduction to programming concepts",
      "fileUrl": "/uploads/lecture_notes_week1.pdf",
      "fileName": "lecture_notes_week1.pdf",
      "fileType": "application/pdf",
      "fileSize": 1024000,
      "course": {
        "_id": "60f7b3b3b3b3b3b3b3b3b4",
        "title": "Introduction to Computer Science"
      },
      "uploadedBy": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3",
        "name": "Dr. Smith"
      },
      "category": "lecture_notes",
      "isPublic": true,
      "uploadedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Get Material by ID
```http
GET /materials/detail/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** Same as upload material response

#### Update Material (Lecturer Only)
```http
PUT /materials/detail/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated Lecture Notes - Week 1",
  "description": "Updated introduction to programming concepts",
  "category": "assignments",
  "isPublic": false
}
```

**Response:** Same as upload material response

#### Delete Material (Lecturer Only)
```http
DELETE /materials/detail/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Material deleted successfully"
}
```

#### Download Material
```http
GET /materials/download/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** File download (binary data)

### Comments Endpoints

#### Add Comment
```http
POST /comments/{announcementId}
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "Thank you for the clarification!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b7",
    "content": "Thank you for the clarification!",
    "announcement": "60f7b3b3b3b3b3b3b3b3b3b5",
    "user": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3",
      "name": "John Doe"
    },
    "isEdited": false,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get Comments by Announcement
```http
GET /comments/{announcementId}?page=1&limit=10
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b7",
      "content": "Thank you for the clarification!",
      "announcement": "60f7b3b3b3b3b3b3b3b3b3b5",
      "user": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3",
        "name": "John Doe"
      },
      "isEdited": false,
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Update Comment
```http
PUT /comments/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "Updated comment content"
}
```

**Response:** Same as add comment response

#### Delete Comment
```http
DELETE /comments/{id}
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

## Data Models

### User
```json
{
  "_id": "ObjectId",
  "name": "String (required, min: 2)",
  "email": "String (required, unique, email format)",
  "password": "String (required, min: 6, hashed)",
  "role": "String (required, enum: ['student', 'lecturer'])",
  "enrolledCourses": ["ObjectId"],
  "createdCourses": ["ObjectId"],
  "avatar": "String (optional)",
  "createdAt": "Date"
}
```

### Course
```json
{
  "_id": "ObjectId",
  "title": "String (required)",
  "code": "String (required, unique)",
  "description": "String (required)",
  "lecturer": "ObjectId (ref: User, required)",
  "students": ["ObjectId (ref: User)"],
  "isActive": "Boolean (default: true)",
  "createdAt": "Date"
}
```

### Announcement
```json
{
  "_id": "ObjectId",
  "title": "String (required)",
  "body": "String (required)",
  "course": "ObjectId (ref: Course, required)",
  "createdBy": "ObjectId (ref: User, required)",
  "isImportant": "Boolean (default: false)",
  "attachments": ["String"],
  "createdAt": "Date"
}
```

### Material
```json
{
  "_id": "ObjectId",
  "title": "String (required)",
  "description": "String",
  "fileUrl": "String (required)",
  "fileName": "String (required)",
  "fileType": "String (required)",
  "fileSize": "Number (required)",
  "course": "ObjectId (ref: Course, required)",
  "uploadedBy": "ObjectId (ref: User, required)",
  "category": "String",
  "isPublic": "Boolean (default: true)",
  "uploadedAt": "Date"
}
```

### Comment
```json
{
  "_id": "ObjectId",
  "content": "String (required)",
  "announcement": "ObjectId (ref: Announcement, required)",
  "user": "ObjectId (ref: User, required)",
  "isEdited": "Boolean (default: false)",
  "editedAt": "Date",
  "createdAt": "Date"
}
```

## File Upload

### Supported File Types
- **Documents:** PDF, DOC, DOCX, TXT
- **Images:** JPG, JPEG, PNG, GIF
- **Maximum File Size:** 10MB

### Upload Process
1. Use `multipart/form-data` content type
2. Include file in the `file` field
3. Include metadata in other fields
4. File is stored in `/uploads` directory
5. File URL is returned in response

### Example Upload
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -F "title=Lecture Notes" \
  -F "description=Week 1 notes" \
  -F "course=60f7b3b3b3b3b3b3b3b3b3b4" \
  -F "category=lecture_notes" \
  -F "isPublic=true" \
  -F "file=@notes.pdf" \
  http://localhost:5000/api/v1/materials/upload
```

## Rate Limiting

Currently, the API does not implement rate limiting. However, it's recommended to:
- Limit requests to reasonable frequencies
- Implement proper error handling
- Use pagination for large datasets

## Examples

### Complete Workflow Example

1. **Register a lecturer:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Smith",
    "email": "smith@university.edu",
    "password": "password123",
    "role": "lecturer"
  }'
```

2. **Login and get token:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "smith@university.edu",
    "password": "password123"
  }'
```

3. **Create a course:**
```bash
curl -X POST http://localhost:5000/api/v1/courses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Computer Science",
    "code": "CS101",
    "description": "Basic programming concepts"
  }'
```

4. **Create an announcement:**
```bash
curl -X POST http://localhost:5000/api/v1/announcements \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Welcome to CS101",
    "body": "Welcome to the course! Please review the syllabus.",
    "course": "<course_id>",
    "isImportant": true
  }'
```

5. **Upload course material:**
```bash
curl -X POST http://localhost:5000/api/v1/materials/upload \
  -H "Authorization: Bearer <token>" \
  -F "title=Syllabus" \
  -F "description=Course syllabus and schedule" \
  -F "course=<course_id>" \
  -F "category=syllabus" \
  -F "file=@syllabus.pdf"
```

### JavaScript/Fetch Examples

```javascript
// Register user
const registerUser = async (userData) => {
  const response = await fetch('http://localhost:5000/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Login user
const loginUser = async (credentials) => {
  const response = await fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials)
  });
  return response.json();
};

// Get courses with authentication
const getCourses = async (token) => {
  const response = await fetch('http://localhost:5000/api/v1/courses', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return response.json();
};

// Upload material
const uploadMaterial = async (token, formData) => {
  const response = await fetch('http://localhost:5000/api/v1/materials/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData
  });
  return response.json();
};
```

### Python Requests Examples

```python
import requests

# Register user
def register_user(user_data):
    response = requests.post(
        'http://localhost:5000/api/v1/auth/register',
        json=user_data
    )
    return response.json()

# Login user
def login_user(credentials):
    response = requests.post(
        'http://localhost:5000/api/v1/auth/login',
        json=credentials
    )
    return response.json()

# Get courses with authentication
def get_courses(token):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(
        'http://localhost:5000/api/v1/courses',
        headers=headers
    )
    return response.json()

# Upload material
def upload_material(token, file_path, metadata):
    headers = {'Authorization': f'Bearer {token}'}
    files = {'file': open(file_path, 'rb')}
    data = metadata
    
    response = requests.post(
        'http://localhost:5000/api/v1/materials/upload',
        headers=headers,
        files=files,
        data=data
    )
    return response.json()
```

This documentation provides comprehensive information about the Scholaria API. For additional support or questions, please refer to the project README or contact the development team. 