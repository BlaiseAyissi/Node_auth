const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const {loger} = require('./middleware/logEvent'); 
const errorHandler = require('./middleware/errorHandler'); 
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const PORT = process.env.PORT ;

//middleware for logger
app.use(loger);

//handle options credentials check - before CORS
//and check cookies credentials requirement
app.use(credentials);
 
//cross origin resource charing
app.use(cors(corsOptions));

//built-in middleware to handle urlencoder from data
app.use(express.urlencoded({extended:false}));

//built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files like css , images and others
app.use('/',express.static(path.join(__dirname , '/public'))); 

//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'))



app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname , 'views' , '404.html'));
    }else if(req.accepts('json')){
        res.json({error: '404 not found'});
    }else{
        res.type('txt').send("404 not found")
    }
    
})

app.use(errorHandler);

app.listen(PORT,()=> console.log(`server running on port ${PORT}`))



