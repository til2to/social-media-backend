import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'
import dotenv from 'dotenv';

const app = express();
dotenv.config();

// { limit: "30mb", extended: true }
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors());

app.use('/posts', postRoutes)
app.use('/user', userRoutes)
app.get('/', (req,res)=>{
    res.send('Welcome to memories API')
})

const PORT = process.env.PORT || 5000;

//USE mongoose to connect to DB
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`DB connected, server running on PORT ${PORT}`)))
    .catch((error) => console.log("could not connect to sever"))
