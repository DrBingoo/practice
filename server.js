const express = require('express');
const db = require('./db-connection');
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const cookieParser = require('cookie-parser');
const requireAuth = require('./middleware/authMiddleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.use(cookieParser());

app.listen(8080, () =>{
    console.log('server is up and running at PORT 8080');
});

//get all restaurants
app.get('/', (req,res) =>{
    res.sendFile('./views/index.html', {root:__dirname});
});

app.get('/aboutus', (req,res) => {
    res.sendFile('./views/about.html', {root:__dirname});
        
});

app.get('/contactus', (req,res) => {
    res.sendFile('./views/contact.html', {root:__dirname});
});

app.get('/restaurant.html/:id', (req,res) => {
    res.sendFile('./views/restaurant.html', {root: __dirname});
});

//get signup page
app.get('/user/signup',(req, res) => {
    res.sendFile('./views/signup.html', {root:__dirname});
});

//get login page
app.get('/user/login', (req, res) => {
    res.sendFile('./views/login.html', {root: __dirname});
});

app.get('/user/profile', (req,res) => {
    res.sendFile('./views/profile.html', {root : __dirname});
});

// userRoutes
app.use(userRoutes);

// restaurantRoutes
app.use(restaurantRoutes);

