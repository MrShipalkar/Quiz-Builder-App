const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authroutes")
const connectDB = require('./config/database');
const quizRoutes= require('./routes/quizroutes')
const auth = require('./middleware/auth')
const cors = require('cors');


const app = express();
dotenv.config();
connectDB();


app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/quiz', auth,quizRoutes);


const port = process.env.PORT;

app.get('/',(req, res)=>{
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    });