const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

// Database configuration (ensure your dbConfig is correctly set up)
const dbConfig = require("./config/db");

//importing the routes
const userRoute = require("./routes/userRoute");
const bookingRoute = require("./routes/bookingRoute");
const ticketRoute = require("./routes/ticketRoute");

// Middleware
app.use(cors()); // Apply CORS middleware here
app.use(express.json()); // Parse JSON bodies

// Route Definitions
app.use("/api/users", userRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/tickets", ticketRoute);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});