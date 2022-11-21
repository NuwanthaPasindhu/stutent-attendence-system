const express = require("express");
require("dotenv").config();
const cors = require("cors");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const sectionRoutes = require("./routes/sectionHead");
const commonRoutes = require("./routes/common");
const dataRoutes = require("./routes/data");

// DB CONNECTION
const dbConnection = require("./config/db.config");
dbConnection();

// DECLARING EXPRESS SESSION
const app = express();

// DEFINE CORS
app.use(cors());

//DEFINE EXPRESS JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DEFINE STATIC FOLDER
app.use("/api/v1/storage", express.static("storage"));

// DEFINE ROUTES
app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/sections/", adminRoutes);
app.use("/api/v1/classes/", sectionRoutes);
app.use("/api/v1/details/", commonRoutes);
app.use("/api/v1/data/", dataRoutes);

// ASSIGN THE PORT
const PORT = process.env.PORT || 4000;

// CREATING AN EXPRESS SERVER
app.listen(PORT, () => {
  console.log(`Server up and run in ${PORT}`);
});
