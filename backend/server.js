require('dotenv').config();

const express = require('express');
const connectDB = require('./config/database'); 
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const announcementRoutes = require('./routes/announcements');
const materialRoutes = require('./routes/materials');
const commentRoutes = require('./routes/comments');

const errorHandler = require('./middleware/errorHandler');

const app = express();

connectDB();

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());

app.use(morgan('combined'));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API" });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'Scholaria API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
}));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/announcements', announcementRoutes);
app.use('/api/v1/materials', materialRoutes);
app.use('/api/v1/comments', commentRoutes);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Scholaria API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Scholaria server running on port ${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/v1/health`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
