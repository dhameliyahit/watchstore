import mongoose from "mongoose";
const connectDB = async () => {
  try {
    let conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/watchstore"
    );
    console.log("Connected to database successfully" + conn.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
