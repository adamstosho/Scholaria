# Scholaria Frontend

A modern, responsive React application built with Next.js 15, TypeScript, and Tailwind CSS for the Scholaria academic communication platform.

## 🚀 Features

- **Modern UI/UX**: Built with shadcn/ui components and Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Authentication**: JWT-based authentication with role-based access
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Responsive Design**: Mobile-first approach with beautiful animations
- **File Management**: Upload, preview, and download course materials
- **Interactive Comments**: Real-time comment system for announcements
- **Role-based Access**: Different interfaces for lecturers and students

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables**
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── comments/         # Comment system
│   ├── file-preview/     # File preview components
│   └── navigation/       # Navigation components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 UI Components

The project uses shadcn/ui components with a custom design system:

- **Cards**: For content containers
- **Buttons**: Multiple variants and sizes
- **Forms**: With validation and error handling
- **Dialogs**: Modal components
- **Navigation**: Sidebar and breadcrumbs
- **Tables**: Data display
- **Badges**: Status indicators

## 🔐 Authentication

The app implements JWT-based authentication with:

- **Login/Register**: User authentication
- **Protected Routes**: Role-based access control
- **Profile Management**: Update user information
- **Auto-logout**: Token expiration handling

## 📊 Data Management

React Query is used for efficient data management:

- **Automatic Caching**: Reduces API calls
- **Background Updates**: Keeps data fresh
- **Optimistic Updates**: Better UX
- **Error Handling**: Graceful error states

## 📱 Responsive Design

The app is fully responsive with:

- **Mobile-first**: Optimized for mobile devices
- **Tablet Support**: Adaptive layouts
- **Desktop Experience**: Full-featured interface
- **Touch-friendly**: Optimized for touch interactions

## 🎭 Animations

Framer Motion provides smooth animations:

- **Page Transitions**: Smooth navigation
- **Loading States**: Engaging loading animations
- **Micro-interactions**: Button and form feedback
- **Staggered Animations**: List and grid animations

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Tailwind Configuration

The project uses a custom Tailwind configuration with:

- **Custom Colors**: Brand colors and semantic colors
- **Custom Spacing**: Consistent spacing scale
- **Custom Typography**: Font families and sizes
- **Dark Mode**: Theme support (ready for implementation)

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify**: Static export
- **Railway**: Full-stack deployment
- **DigitalOcean**: App Platform
- **AWS**: Amplify or EC2

## 🧪 Testing

To add testing to the project:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🐛 Troubleshooting

### Common Issues

1. **API Connection**: Ensure backend is running on port 5000
2. **Build Errors**: Check TypeScript types and imports
3. **Styling Issues**: Verify Tailwind classes and CSS imports
4. **Authentication**: Clear localStorage if token issues occur

### Development Tips

- Use React DevTools for debugging
- Check Network tab for API calls
- Use TypeScript strict mode for better type safety
- Follow the existing code patterns and conventions

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Support

For support and questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with details
4. Contact the development team

## 🔄 Updates

Stay updated with the latest changes:

- Follow the repository for updates
- Check the changelog
- Review breaking changes before updating
- Test thoroughly after updates 