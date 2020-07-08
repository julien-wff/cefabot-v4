import mongoose from 'mongoose';

const initDB = () => mongoose.connect(process.env.DB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export default initDB;
