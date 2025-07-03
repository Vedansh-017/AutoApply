import mongoose from "mongoose";
const connectDB = async () => {

    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected successfully");
    });
   await mongoose.connect(`${process.env.MONGODB_URI}/auto-apply?retryWrites=true&w=majority`);
};

export default connectDB;
// This code connects to a MongoDB database using Mongoose.
// It listens for the "connected" event to log a success message.