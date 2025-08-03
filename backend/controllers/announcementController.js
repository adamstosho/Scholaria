const Announcement = require('../models/Announcement');
const Course = require('../models/Course');
const Comment = require('../models/Comment');

const getAllAnnouncements = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const courses = await Course.find({
      $or: [
        { students: req.user.id },
        { lecturer: req.user.id }
      ]
    });

    const courseIds = courses.map(course => course._id);

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
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, body, courseId, isImportant } = req.body;

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

const getAnnouncementsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

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

    const course = await Course.findById(announcement.course);
    const isEnrolled = course.students.includes(req.user.id);
    const isLecturer = course.lecturer.toString() === req.user.id;

    if (!isEnrolled && !isLecturer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this announcement'
      });
    }
    const comments = await Comment.find({ announcement: announcementId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

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
const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

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