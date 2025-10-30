const axios = require('axios');
const cron = require('node-cron');
const DataModel = require('../models/DataModel');

/**
 * Fetch data from MGNREGA API
 * This job runs periodically to fetch and update MGNREGA data
 */
const fetchMGNREGAData = async () => {
  try {
    console.log('Starting MGNREGA data fetch job...');
    
    const API_BASE_URL = process.env.MGNREGA_API_URL || 'https://nregastrep.nic.in/netnrega/dynamic_account_details_ippe.aspx';
    
    // Fetch data from API
    const response = await axios.get(API_BASE_URL, {
      timeout: 30000,
      headers: {
        'User-Agent': 'MGNREGA-Backend-Service'
      }
    });
    
    if (response.data) {
      // Process and store the data
      console.log('Data fetched successfully, processing...');
      
      // TODO: Add your data processing logic here
      // Example: await DataModel.create(processedData);
      
      console.log('MGNREGA data fetch job completed successfully');
    }
  } catch (error) {
    console.error('Error fetching MGNREGA data:', error.message);
    // TODO: Add error notification/alerting logic
  }
};

/**
 * Schedule the data fetch job
 * Runs every day at midnight
 */
const scheduleDataFetch = () => {
  // Run at midnight every day (0 0 * * *)
  cron.schedule('0 0 * * *', () => {
    console.log('Running scheduled MGNREGA data fetch...');
    fetchMGNREGAData();
  });
  
  console.log('Data fetch job scheduled successfully');
};

// Export functions
module.exports = {
  fetchMGNREGAData,
  scheduleDataFetch
};
