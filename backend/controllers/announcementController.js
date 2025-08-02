const Announcement = require('../models/Announcement');
const Course = require('../models/Course');
const Comment = require('../models/Comment');

// @desc    Get all announcements for user (across all enrolled courses)
// @route   GET /api/v1/announcements
// @access  Private
const getAllAnnouncements = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Get all courses where user is enrolled or is lecturer
    const courses = await Course.find({
      $or: [
        { students: req.user.id },
        { lecturer: req.user.id }
      ]
    });

    const courseIds = courses.map(course => course._id);

    // Get announcements from all user's courses
    const announcements = await Announcement.find({
      course: { $in: courseIds }
    })
      .populate('createdBy', 'name email')
      .populate('course', 'title code')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ isImportant: -1, createdAt: -1 });

    const total = await Announcement.countDocuments({
      course: { $in: courseIds }
    });

    res.status(200).json({
      success: true,
      data: announcements,
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

// @desc    Create announcement
// @route   POST /api/v1/announcements
// @access  Private (Lecturer only)
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, body, courseId, isImportant } = req.body;

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
        message: 'Not authorized to post announcements for this course'
      });
    }

    const announcement = await Announcement.create({
      title,
      body,
      course: courseId,
      createdBy: req.user.id,
      isImportant: isImportant || false
    });

    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('createdBy', 'name email')
      .populate('course', 'title code');

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: populatedAnnouncement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get announcements by course
// @route   GET /api/v1/announcements/:courseId
// @access  Private
const getAnnouncementsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;

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
        message: 'Not authorized to view announcements for this course'
      });
    }

    const announcements = await Announcement.find({ course: courseId })
      .populate('createdBy', 'name email')
      .populate('course', 'title code')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ isImportant: -1, createdAt: -1 });

    const total = await Announcement.countDocuments({ course: courseId });

    res.status(200).json({
      success: true,
      data: announcements,
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

// @desc    Get single announcement
// @route   GET /api/v1/announcements/detail/:id
// @access  Private
const getAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('course', 'title code');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Check if user is enrolled in the course or is the lecturer
    const course = await Course.findById(announcement.course);
    const isEnrolled = course.students.includes(req.user.id);
    const isLecturer = course.lecturer.toString() === req.user.id;

    if (!isEnrolled && !isLecturer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this announcement'
      });
    }

    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get announcement with comments
// @route   GET /api/v1/announcements/:id/with-comments
// @access  Private
const getAnnouncementWithComments = async (req, res, next) => {
  try {
    const announcementId = req.params.id;

    const announcement = await Announcement.findById(announcementId)
      .populate('createdBy', 'name email')
      .populate('course', 'title code');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Check if user is enrolled in the course or is the lecturer
    const course = await Course.findById(announcement.course);
    const isEnrolled = course.students.includes(req.user.id);
    const isLecturer = course.lecturer.toString() === req.user.id;

    if (!isEnrolled && !isLecturer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this announcement'
      });
    }

    // Get comments for this announcement
    const comments = await Comment.find({ announcement: announcementId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Get comment count
    const commentCount = await Comment.countDocuments({ announcement: announcementId });

    res.status(200).json({
      success: true,
      data: {
        announcement,
        comments,
        commentCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update announcement
// @route   PUT /api/v1/announcements/:id
// @access  Private (Lecturer only)
const updateAnnouncement = async (req, res, next) => {
  try {
    const { title, body, isImportant } = req.body;

    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Check if user is the creator
    if (announcement.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this announcement'
      });
    }

    announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, body, isImportant },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('course', 'title code');

    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete announcement
// @route   DELETE /api/v1/announcements/:id
// @access  Private (Lecturer only)
const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Check if user is the creator
    if (announcement.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this announcement'
      });
    }

    await Announcement.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAnnouncements,
  createAnnouncement,
  getAnnouncementsByCourse,
  getAnnouncement,
  getAnnouncementWithComments,
  updateAnnouncement,
  deleteAnnouncement
}; 