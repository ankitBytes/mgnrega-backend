const mongoose = require('mongoose');

/**
 * Database connection utility
 * Connects to MongoDB using Mongoose
 */
const dbConnect = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mgnrega';
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    
    await mongoose.connect(mongoURI, options);
    
    console.log('MongoDB connected successfully');
    console.log(`Database: ${mongoose.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = dbConnect;
