const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const productRoutes = require('./apis/products');
const orderRoutes = require('./apis/orders');
const userRoutes = require('./apis/user');

var MongoClient = require('mongoose');

MongoClient.connect("mongodb://localhost:27017/sample2",{useUnifiedTopology: true, useNewUrlParser: true }, function (err, db) {
   
     if(err) throw err;
    console.log("Connected to local database");
                
});
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);
app.use((req,res,next)=>{
    const error = new Error('No Page Found');
    error.status =404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json(
        {
            message:error.message
        }
    )
});
//app.use(app.router);
//productRoutes.initialize(app);

module.exports = app;