if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const express = require('express');
const app = express();
const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');



// console.log("Key: ", process.env.CLOUDINARY_KEY);

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
// MIDDLEWARE

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
    secret: 'badSecret',
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) =>{
    // console.log(req.session.id);
    // console.log(req.session);
    
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/users', userRoutes);


app.listen(3000, () =>{
    console.log('\n\n Server on http://localhost:3000/campgrounds \n\n')
});

app.get('/', (req, res)=> {
    res.render('home');
});

app.get('/makecamp', async (req, res)=> {
    const camp = new Campground({title: "my bcakyard", price:"100"});
    camp.save();
    res.send(camp);
});

app.all('*', (req,res,next) => {
    next(new ExpressError('Page not Found', 404));
});

app.use((err, req, res, next) =>{
    const { statusCode = 500 } = err;
    if(!err.message) message="sumthin wrong";
    res.status(statusCode).render('error',{err});
});



