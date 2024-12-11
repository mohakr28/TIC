const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 3000; // Use PORT from .env or default to 3000

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON bodies

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Routes
    app.get("/", (req, res) => res.send("Hello World!"));
    routes(app);

    // Start the server
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
