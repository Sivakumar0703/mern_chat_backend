import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()

const dbConnectionString = process.env.MONGO_CONNECTION_URL;

const ConnectDb = async() => {
    try{
        const connection = await mongoose.connect(dbConnectionString);
        console.log('MongoDB connected');
        return connection
    } catch (error) {
        console.log('error in mongoDB connection',error)
    }
}

export default ConnectDb