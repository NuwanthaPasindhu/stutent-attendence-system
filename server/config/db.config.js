const mongoose = require("mongoose");

async function dbConnection() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database connected: ${conn.connection.host} ...`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

module.exports = dbConnection;
