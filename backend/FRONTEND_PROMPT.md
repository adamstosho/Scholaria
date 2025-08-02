# Scholaria Frontend Development Prompt

## Project Overview
Build a modern, fully functional, and beautifully designed frontend application for **Scholaria** - an academic communication platform for lecturers and students. This is a comprehensive classroom announcements and materials hub that enables seamless interaction between educators and learners.

## Technical Requirements

### Core Technologies (MANDATORY)
- **Next.js 14+** with App Router
- **TypeScript** (strict mode enabled)
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Zod** for validation
- **Axios** for API calls
- **React Query/TanStack Query** for state management
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Additional Libraries
- **@headlessui/react** for accessible UI components
- **clsx** or **class-variance-authority** for conditional styling
- **date-fns** for date formatting
- **react-dropzone** for file uploads
- **react-markdown** for rendering markdown content

## Design & UX Requirements

### Visual Design
- **Modern & Clean**: Minimalist design with excellent visual hierarchy
- **Color Scheme**: Professional academic theme with:
  - Primary: Deep blue (#1e40af) or emerald (#059669)
  - Secondary: Slate grays (#64748b, #94a3b8)
  - Accent: Warm orange (#f97316) for important elements
  - Success: Green (#10b981)
  - Error: Red (#ef4444)
- **Typography**: Inter or Poppins font family
- **Spacing**: Consistent 4px grid system
- **Shadows**: Subtle elevation with proper depth

### Animations & Interactions
- **Page Transitions**: Smooth fade-in/out with Framer Motion
- **Loading States**: Skeleton loaders and spinners
- **Hover Effects**: Subtle scale and color transitions
- **Micro-interactions**: Button clicks, form submissions, notifications
- **Responsive Animations**: Different animations for mobile/desktop

### User Experience
- **Intuitive Navigation**: Clear breadcrumbs and navigation
- **Progressive Disclosure**: Show information as needed
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile-First**: Responsive design for all screen sizes
- **Error Handling**: User-friendly error messages and recovery
- **Loading States**: Clear feedback for all async operations

## Application Structure

### Core Features (Must Implement All)

#### 1. Authentication System
- **Login/Register Pages**: Beautiful forms with validation
- **Role-Based Access**: Different interfaces for students vs lecturers
- **JWT Token Management**: Secure token storage and refresh
- **Protected Routes**: Route guards for authenticated users
- **Profile Management**: User profile viewing and editing

#### 2. Dashboard
- **Role-Specific Dashboards**:
  - **Lecturer Dashboard**: Course management, announcements, materials
  - **Student Dashboard**: Enrolled courses, recent announcements, materials
- **Quick Actions**: Common tasks easily accessible
- **Recent Activity**: Timeline of recent activities
- **Statistics**: Course counts, announcement counts, etc.

#### 3. Course Management
- **Course List**: Grid/list view with search and filters
- **Course Details**: Comprehensive course information
- **Course Creation** (Lecturers): Form to create new courses
- **Course Enrollment** (Students): Easy enrollment process
- **Course Settings** (Lecturers): Edit course details

#### 4. Announcements System
- **Announcement List**: Chronological list with importance indicators
- **Announcement Creation** (Lecturers): Rich text editor with attachments
- **Announcement Details**: Full view with comments
- **Importance Marking**: Visual indicators for important announcements
- **Attachment Support**: File preview and download

#### 5. Materials Management
- **Materials Library**: Organized by course and category
- **File Upload** (Lecturers): Drag-and-drop interface
- **File Preview**: PDF, image, and document previews
- **Download System**: Secure file downloads
- **Category Organization**: Filter by material type

#### 6. Comments System
- **Comment Threads**: Nested comments on announcements
- **Real-time Updates**: Live comment updates
- **Comment Management**: Edit/delete own comments
- **Rich Text**: Basic formatting support

## API Integration Requirements

### Backend API Details
- **Base URL**: `http://localhost:5000/api/v1`
- **Authentication**: JWT Bearer token
- **Content-Type**: `application/json`
- **File Uploads**: `multipart/form-data`

### API Endpoints to Implement

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

#### Courses
- `GET /courses` - List all courses (with pagination)
- `POST /courses` - Create course (lecturers only)
- `GET /courses/{id}` - Get course details
- `PUT /courses/{id}` - Update course (lecturers only)
- `DELETE /courses/{id}` - Delete course (lecturers only)
- `POST /courses/{id}/enroll` - Enroll in course (students only)

#### Announcements
- `GET /announcements/{courseId}` - Get course announcements
- `POST /announcements` - Create announcement (lecturers only)
- `GET /announcements/detail/{id}` - Get announcement details
- `PUT /announcements/detail/{id}` - Update announcement (lecturers only)
- `DELETE /announcements/detail/{id}` - Delete announcement (lecturers only)

#### Materials
- `GET /materials/{courseId}` - Get course materials
- `POST /materials/upload` - Upload material (lecturers only)
- `GET /materials/detail/{id}` - Get material details
- `PUT /materials/detail/{id}` - Update material (lecturers only)
- `DELETE /materials/detail/{id}` - Delete material (lecturers only)
- `GET /materials/download/{id}` - Download material

#### Comments
- `GET /comments/{announcementId}` - Get announcement comments
- `POST /comments/{announcementId}` - Add comment
- `PUT /comments/{id}` - Update comment
- `DELETE /comments/{id}` - Delete comment

### Data Models to Implement

#### User Model
```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer';
  enrolledCourses: string[];
  createdCourses: string[];
  avatar?: string;
  createdAt: string;
}
```

#### Course Model
```typescript
interface Course {
  _id: string;
  title: string;
  code: string;
  description: string;
  lecturer: User;
  students: User[];
  isActive: boolean;
  createdAt: string;
}
```

#### Announcement Model
```typescript
interface Announcement {
  _id: string;
  title: string;
  body: string;
  course: Course;
  createdBy: User;
  isImportant: boolean;
  attachments: string[];
  createdAt: string;
}
```

#### Material Model
```typescript
interface Material {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  course: Course;
  uploadedBy: User;
  category?: string;
  isPublic: boolean;
  uploadedAt: string;
}
```

#### Comment Model
```typescript
interface Comment {
  _id: string;
  content: string;
  announcement: string;
  user: User;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
}
```

## File Structure Requirements

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── courses/
│   │   ├── announcements/
│   │   ├── materials/
│   │   └── profile/
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── dropdown.tsx
│   │   └── ...
│   ├── forms/
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   ├── course-form.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── footer.tsx
│   │   └── navigation.tsx
│   └── features/
│       ├── courses/
│       ├── announcements/
│       ├── materials/
│       └── comments/
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── validations.ts
├── hooks/
│   ├── use-auth.ts
│   ├── use-courses.ts
│   ├── use-announcements.ts
│   └── ...
├── types/
│   ├── api.ts
│   ├── auth.ts
│   └── ...
└── styles/
    └── components.css
```

## Implementation Guidelines

### 1. Error Handling
- **Global Error Boundary**: Catch and handle all errors gracefully
- **API Error Handling**: Proper error messages for all API calls
- **Form Validation**: Real-time validation with clear error messages
- **Network Errors**: Handle offline states and connection issues

### 2. Performance Optimization
- **Code Splitting**: Lazy load components and pages
- **Image Optimization**: Use Next.js Image component
- **Caching**: Implement proper caching strategies
- **Bundle Optimization**: Minimize bundle size

### 3. Security
- **Input Sanitization**: Sanitize all user inputs
- **XSS Prevention**: Proper content escaping
- **CSRF Protection**: Implement CSRF tokens
- **Secure Storage**: Secure token storage

### 4. Testing Requirements
- **Unit Tests**: Test all utility functions and components
- **Integration Tests**: Test API integrations
- **E2E Tests**: Test critical user flows
- **Accessibility Tests**: Ensure accessibility compliance

## Quality Standards

### Code Quality
- **TypeScript**: Strict mode, no `any` types
- **ESLint**: Configured with strict rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality checks

### Performance
- **Lighthouse Score**: 90+ on all metrics
- **Core Web Vitals**: Excellent scores
- **Bundle Size**: Optimized and minimal
- **Loading Speed**: Fast initial load and navigation

### Accessibility
- **WCAG 2.1 AA**: Full compliance
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and roles
- **Color Contrast**: Sufficient contrast ratios

## Deployment Requirements

### Environment Setup
- **Environment Variables**: Proper configuration
- **Build Process**: Optimized production build
- **Static Assets**: Proper asset optimization
- **API Configuration**: Production API endpoints

### Monitoring
- **Error Tracking**: Implement error monitoring
- **Analytics**: User behavior tracking
- **Performance Monitoring**: Real user monitoring
- **Uptime Monitoring**: Service availability

## Success Criteria

### Functional Requirements
- ✅ All API endpoints properly integrated
- ✅ Role-based access control working
- ✅ File upload/download functionality
- ✅ Real-time updates for comments
- ✅ Responsive design on all devices
- ✅ Offline capability for basic features

### Performance Requirements
- ✅ Page load time < 2 seconds
- ✅ Lighthouse score > 90
- ✅ Zero console errors
- ✅ Smooth animations (60fps)
- ✅ Fast navigation between pages

### User Experience Requirements
- ✅ Intuitive navigation
- ✅ Clear visual hierarchy
- ✅ Consistent design language
- ✅ Helpful error messages
- ✅ Loading states for all actions
- ✅ Success feedback for actions

## Additional Notes

### Important Considerations
1. **Mobile-First Design**: Ensure excellent mobile experience
2. **Progressive Enhancement**: Work without JavaScript
3. **Internationalization Ready**: Prepare for multiple languages
4. **SEO Optimized**: Proper meta tags and structure
5. **PWA Ready**: Service worker and manifest

### Development Workflow
1. Set up project with Next.js 14+ and TypeScript
2. Configure Tailwind CSS and essential dependencies
3. Implement authentication system first
4. Build core UI components
5. Implement API integration layer
6. Build feature components one by one
7. Add animations and polish
8. Test thoroughly on all devices
9. Optimize performance
10. Deploy and monitor

### Testing Checklist
- [ ] All pages render without errors
- [ ] All forms submit successfully
- [ ] File uploads work correctly
- [ ] Authentication flows work
- [ ] Role-based access is enforced
- [ ] Responsive design works on all screen sizes
- [ ] Animations are smooth
- [ ] Error handling works properly
- [ ] Loading states are implemented
- [ ] Accessibility requirements are met

This frontend should be a **production-ready, enterprise-grade application** that provides an exceptional user experience for both lecturers and students in the Scholaria academic platform. 