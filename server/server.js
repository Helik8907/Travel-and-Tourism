const express = require('express');
const { port,mongoUrl } = require('./config/config');
const mongoose = require('mongoose');
const requestLogger = require('./middleware/requestLogger');
const { successColor, errorColor } = require('./utils/colors');

const app = express();
const registrationRoute=require("./routes/registration");
const mongoose=require("mongoose");

app.use(express.json());
app.use(requestLogger);

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

//registration route
app.use("/",registrationRoute);
