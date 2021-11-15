require('./db/mongoose');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const ejs = require('ejs');

const viewsRouter = require('./routers/viewRoutes');
const userRouter = require('./routers/userRoutes');
const tithesRouter = require('./routers/tithesRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
//paths
const publicDirectory = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../views');
const app = express();
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// const DB = process.env.MONGODB_URL;

const store = new MongoDBStore({
  uri: DB,
  collection: 'sessions',
});

//Define paths for express config
app.set('view engine', 'ejs');
app.set('views', viewsPath);
//Global middlewares
app.use(cors());
app.options('*', cors());
// sessions
app.use(
  session({
    secret: 'mysecretshouldbelong',
    resave: false,
    saveUninitialized: false,
    store,
  })
);
//SET security HTTP headers
app.use(helmet());
//Development logging
if (process.env.NODE_ENV.trim() === 'development') {
  app.use(morgan('dev'));
}
//Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
// app.use('/', limiter);

//setup public directory to serve
//serving static files
app.use(express.static(publicDirectory));
//Body parser, reading data from the body into req.body
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10kb' }));

//Parsing data from cookies
app.use(cookieParser());
//Data sanitization against NOSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    //To be excluded
    whitelist: ['duration'],
  })
);

// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });
app.use('/', viewsRouter);
app.use('/api/v1/', userRouter);
app.use('/api/v1/tithes', tithesRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

console.log(process.env.NODE_ENV);

app.use(globalErrorHandler);

module.exports = app;
