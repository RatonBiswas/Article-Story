const path = require('path')
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chalk = require('chalk');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const storiesRouter = require('./routes/stories');

// ** Load Config file
dotenv.config({ path: './config/config.env'});

// ** passport config 
require('./config/passport')(passport);
// require('./config/passport')(passportt)

// ** Connect mongodb
connectDB()

const app = express();

// ** Body parser 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ** HTTP request loger middleware 'Logging'
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

 // ** handlebars helpers 
 const {formatDate} = require('./halper/hbs')


// ** Setting the app's "view engine" setting will make that value the default file extension used for looking up views.
// ** Handlebars
app.engine('.hbs', exphbs({helpers: {formatDate}, defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// ** session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store : new MongoStore({mongooseConnection: mongoose.connection})
}))



// ** passport middleware 
app.use(passport.initialize());
app.use(passport.session());

// ** static forlder 
app.use(express.static(path.join(__dirname, 'public')));


// ** routes
app.use('/',indexRouter);
app.use('/auth',authRouter);
app.use('/stories',storiesRouter);


const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(
    `Server running in ${chalk.greenBright(process.env.NODE_ENV)} mode on port ${chalk.greenBright(
      PORT,
    )}`,
  ),
);
