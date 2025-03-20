const mongoose = require("mongoose");

exports.connectDatabase = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI); // Add this line for debugging
    
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(
      `MongoDB connected to ${mongoose.connection.host} successfully`
    );
  } catch (error) {
    console.log(`Error while connecting MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};
