import mongoose from 'mongoose';

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "Aurora",
    }).then(()=>{
        console.log("Database connected successfully.");
    }).catch(err=>{
        console.log("Error connecting to database" , err);
    });
}

export default connectDB;