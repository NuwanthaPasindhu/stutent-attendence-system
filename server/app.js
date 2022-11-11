const express = require("express");
require("dotenv").config();
const cors = require("cors");
const authRoutes = require("./routes/auth");


// DB CONNECTION
const dbConnection = require('./config/db.config');
dbConnection();

// DECLARING EXPRESS SESSION
const app = express();

// DEFINE CORS
app.use(cors());


//DEFINE EXPRESS JSON
app.use(express.json());

// ASSIGN THE PORT 
const PORT = process.env.PORT || 4000;

// CREATING AN EXPRESS SERVER
app.listen(PORT, () => {
    console.log(`Server up and run in port ${PORT}`)
})