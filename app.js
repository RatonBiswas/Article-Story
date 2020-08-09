const express = require('express');
const dotenv = require('dotenv');
const chalk = require('chalk');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const connectDB = require('./config/db');
const indexRouter = require('./routes/index');

// ** Load Config file
dotenv.config({ path: './config/config.env'});

// ** Connect mongodb
connectDB()

const app = express();

// ** HTTP request loger middleware 'Logging'
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// ** Setting the app's "view engine" setting will make that value the default file extension used for looking up views.
// ** Handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// ** routes
app.use('/',indexRouter);

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(
    `Server running in ${chalk.greenBright(process.env.NODE_ENV)} mode on port ${chalk.greenBright(
      PORT,
    )}`,
  ),
);
