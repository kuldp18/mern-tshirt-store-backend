require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const corsMiddleware = require('./cors');

// my routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const stripeRoutes = require('./routes/stripePayment');
const braintreeRoutes = require('./routes/paypalPayment');
// DB connection
mongoose
  .connect(process.env.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB CONNECTED!');
  });

// global middlewares

app.use(bodyParser.json());
app.use(cookieParser());
app.options('*', corsMiddleware);
app.use(corsMiddleware);

// My routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', stripeRoutes);
app.use('/api', braintreeRoutes);
// port
const port = process.env.PORT || 8888;

// starting a server
app.listen(port, () => {
  console.log(`App is running at ${port}`);
});
