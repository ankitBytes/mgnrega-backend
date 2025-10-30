const DataModel = require('../models/DataModel');

/**
 * @desc    Get all MGNREGA data
 * @route   GET /api/data
 * @access  Public
 */
const getAllData = async (req, res) => {
  try {
    const { page = 1, limit = 10, state, district } = req.query;
    
    const query = {};
    if (state) query.state = state;
    if (district) query.district = district;
    
    const data = await DataModel.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await DataModel.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
      error: error.message
    });
  }
};

/**
 * @desc    Get single MGNREGA data by ID
 * @route   GET /api/data/:id
 * @access  Public
 */
const getDataById = async (req, res) => {
  try {
    const data = await DataModel.findById(req.params.id);
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Data not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
      error: error.message
    });
  }
};

/**
 * @desc    Get statistics
 * @route   GET /api/data/stats
 * @access  Public
 */
const getStatistics = async (req, res) => {
  try {
    // TODO: Implement statistics aggregation logic
    const stats = {
      totalRecords: await DataModel.countDocuments(),
      // Add more statistics as needed
    };
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllData,
  getDataById,
  getStatistics
};
