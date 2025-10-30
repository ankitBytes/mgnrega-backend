const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      trim: true
    },
    district: {
      type: String,
      required: true,
      trim: true
    },
    block: {
      type: String,
      trim: true
    },
    panchayat: {
      type: String,
      trim: true
    },
    financialYear: {
      type: String,
      required: true
    },
    // Work-related fields
    totalWorks: {
      type: Number,
      default: 0
    },
    completedWorks: {
      type: Number,
      default: 0
    },
    ongoingWorks: {
      type: Number,
      default: 0
    },
    // Employment data
    totalJobCards: {
      type: Number,
      default: 0
    },
    activeWorkers: {
      type: Number,
      default: 0
    },
    totalPersonDays: {
      type: Number,
      default: 0
    },
    // Financial data
    totalExpenditure: {
      type: Number,
      default: 0
    },
    wageExpenditure: {
      type: Number,
      default: 0
    },
    materialExpenditure: {
      type: Number,
      default: 0
    },
    // Additional metadata
    dataSource: {
      type: String,
      default: 'MGNREGA API'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Create indexes for better query performance
DataSchema.index({ state: 1, district: 1, financialYear: 1 });
DataSchema.index({ lastUpdated: -1 });

const DataModel = mongoose.model('Data', DataSchema);

module.exports = DataModel;
