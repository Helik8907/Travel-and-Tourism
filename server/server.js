const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { port,mongoUrl } = require('./config/config');
const mongoose = require('mongoose');
const requestLogger = require('./middleware/requestLogger');
const { successColor, errorColor } = require('./utils/colors');
const loginRoutes = require('./routes/login');
const signupRoutes = require('./routes/signup');
const logoutRoutes = require('./routes/logout');
const meRoutes = require('./routes/me');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use('/api/login', loginRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/logout', logoutRoutes);
app.use('/api/me', meRoutes);

connectDB = async () => {
    try {
        await mongoose.connect(mongoUrl); // Database connected.
        console.log(successColor, '✅ Database Connected successfully...');
    } catch (error) {
        console.log(errorColor, '❌ Database Connections Error :', error);
    }
};

connectDB();

app.get('/', (req, res) => {
  res.send({ message: 'Travel & Tourism API placeholder' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

