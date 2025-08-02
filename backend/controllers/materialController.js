const Material = require('../models/Material');
const Course = require('../models/Course');
const fs = require('fs');
const path = require('path');

// @desc    Upload material
// @route   POST /api/v1/materials/upload
// @access  Private (Lecturer only)
const uploadMaterial = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const { title, description, courseId, category } = req.body;

    // Check if course exists and user is the lecturer
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.lecturer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload materials for this course'
      });
    }

    const material = await Material.create({
      title,
      description,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      course: courseId,
      uploadedBy: req.user.id,
      category: category || 'other'
    });

    const populatedMaterial = await Material.findById(material._id)
      .populate('uploadedBy', 'name email')
      .populate('course', 'title code');

    res.status(201).json({
      success: true,
      message: 'Material uploaded successfully',
      data: populatedMaterial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get materials by course
// @route   GET /api/v1/materials/:courseId
// @access  Private
const getMaterialsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10, category } = req.query;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled in the course or is the lecturer
    const isEnrolled = course.students.includes(req.user.id);
    const isLecturer = course.lecturer.toString() === req.user.id;

    if (!isEnrolled && !isLecturer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view materials for this course'
      });
    }

    let query = { course: courseId };

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    const materials = await Material.find(query)
      .populate('uploadedBy', 'name email')
      .populate('course', 'title code')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Material.countDocuments(query);

    res.status(200).json({
      success: true,
      data: materials,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single material
// @route   GET /api/v1/materials/detail/:id
// @access  Private
const getMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('uploadedBy', 'name email')
      .populate('course', 'title code');

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    // Check if user is enrolled in the course or is the lecturer
    const course = await Course.findById(material.course);
    const isEnrolled = course.students.includes(req.user.id);
    const isLecturer = course.lecturer.toString() === req.user.id;

    if (!isEnrolled && !isLecturer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this material'
      });
    }

    res.status(200).json({
      success: true,
      data: material
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get material details with additional metadata
// @route   GET /api/v1/materials/:id/details
// @access  Private
const getMaterialDetails = async (req, res, next) => {
  try {
    const materialId = req.params.id;

    const material = await Material.findById(materialId)
      .populate('uploadedBy', 'name email')
      .populate('course', 'title code');

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    // Check if user is enrolled in the course or is the lecturer
    const course = await Course.findById(material.course);
    const isEnrolled = course.students.includes(req.user.id);
    const isLecturer = course.lecturer.toString() === req.user.id;

    if (!isEnrolled && !isLecturer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this material'
      });
    }

    // Check if file exists
    const filePath = path.join(__dirname, '..', material.fileUrl);
    const fileExists = fs.existsSync(filePath);

    // Get file stats if file exists
    let fileStats = null;
    if (fileExists) {
      try {
        fileStats = fs.statSync(filePath);
      } catch (error) {
        console.error('Error getting file stats:', error);
      }
    }

    // Determine if file can be previewed
    const canPreview = material.fileType.startsWith('image/') || 
                      material.fileType === 'application/pdf' ||
                      material.fileType === 'text/plain';

    res.status(200).json({
      success: true,
      data: {
        material,
        fileInfo: {
          exists: fileExists,
          canPreview,
          lastModified: fileStats?.mtime,
          size: fileStats?.size || material.fileSize
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update material
// @route   PUT /api/v1/materials/:id
// @access  Private (Lecturer only)
const updateMaterial = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    let material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    // Check if user is the uploader
    if (material.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this material'
      });
    }

    material = await Material.findByIdAndUpdate(
      req.params.id,
      { title, description, category },
      { new: true, runValidators: true }
    )
      .populate('uploadedBy', 'name email')
      .populate('course', 'title code');

    res.status(200).json({
      success: true,
      message: 'Material updated successfully',
      data: material
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete material
// @route   DELETE /api/v1/materials/:id
// @access  Private (Lecturer only)
const deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    // Check if user is the uploader
    if (material.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this material'
      });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', 'uploads', path.basename(material.fileUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Material.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download material
// @route   GET /api/v1/materials/download/:id
// @access  Private
const downloadMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    // Check if user is enrolled in the course or is the lecturer
    const course = await Course.findById(material.course);
    const isEnrolled = course.students.includes(req.user.id);
    const isLecturer = course.lecturer.toString() === req.user.id;

    if (!isEnrolled && !isLecturer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this material'
      });
    }

    const filePath = path.join(__dirname, '..', 'uploads', path.basename(material.fileUrl));

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Set appropriate headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${material.fileName}"`);
    res.setHeader('Content-Type', material.fileType);
    res.setHeader('Content-Length', material.fileSize);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all materials for a user (across all their courses)
// @route   GET /api/v1/materials
// @access  Private
const getAllMaterials = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;

    // Get all courses where user is enrolled or is lecturer
    const userCourses = await Course.find({
      $or: [
        { students: req.user.id },
        { lecturer: req.user.id }
      ]
    }).select('_id');

    const courseIds = userCourses.map(course => course._id);

    if (courseIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          pages: 0
        }
      });
    }

    let query = { course: { $in: courseIds } };

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Material.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const materials = await Material.find(query)
      .populate('uploadedBy', 'name email')
      .populate('course', 'title code')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json({
      success: true,
      data: materials,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Preview material (for images and PDFs)
// @route   GET /api/v1/materials/preview/:id
// @access  Private
const previewMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    // Check if user is enrolled in the course or is the lecturer
    const course = await Course.findById(material.course);
    const isEnrolled = course.students.includes(req.user.id);
    const isLecturer = course.lecturer.toString() === req.user.id;

    if (!isEnrolled && !isLecturer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to preview this material'
      });
    }

    // Check if file can be previewed
    const canPreview = material.fileType.startsWith('image/') || 
                      material.fileType === 'application/pdf' ||
                      material.fileType === 'text/plain';

    if (!canPreview) {
      return res.status(400).json({
        success: false,
        message: 'This file type cannot be previewed'
      });
    }

    const filePath = path.join(__dirname, '..', 'uploads', path.basename(material.fileUrl));

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Set appropriate headers for preview
    res.setHeader('Content-Type', material.fileType);
    res.setHeader('Content-Length', material.fileSize);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadMaterial,
  getAllMaterials,
  getMaterialsByCourse,
  getMaterial,
  getMaterialDetails,
  updateMaterial,
  deleteMaterial,
  downloadMaterial,
  previewMaterial
}; 