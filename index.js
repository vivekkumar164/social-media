import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import AuthRoute from './Routes/AuthRoute.js';
import userRoute from './Routes/userRoute.js'
import postRoute from './Routes/postRoute.js'


const app = express();


//Middlewares
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

dotenv.config();
app.use(cors());


mongoose.connect(process.env.MONGO_DB,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`listening at port ${process.env.PORT}`))
    })
    .catch((error)=>{
        console.log('error-->',error);
    })


    //usage of routes
    app.use('/auth',AuthRoute);
    app.use('/users',userRoute);
    app.use('/posts',postRoute);
