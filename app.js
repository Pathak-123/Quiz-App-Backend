const express=require('express');
const cors=require('cors');
const dotenv = require('dotenv');
const connectDB  = require('./utils/features');
const userRoutes = require('./routes/User.js');
const quizRoutes = require('./routes/Quiz.js');

dotenv.config();

const app=express();
const port= process.env.PORT || 3000;
const mongoURI= process.env.MONGO_URI || "";

connectDB(mongoURI);
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRoutes);

app.use("/api/v1/quiz", quizRoutes);

app.listen(port,()=>{
    console.log(`Server is working on localhost: ${port}`);
})