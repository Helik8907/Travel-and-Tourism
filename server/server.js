const express = require('express');
const app = express();
const registrationRoute=require("./routes/registration");
<<<<<<< Updated upstream
=======
const mongoose=require("mongoose");
>>>>>>> Stashed changes

app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Travel & Tourism API placeholder' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//registration route
app.use("/",registrationRoute);
