const express = require("express");

const app = express();

const dbConfig = require('./db')
const roomsRoute = require('./routes/roomsRoute')
const usersRoute = require('./routes/usersRoute')
const bookingsRoute = require('./routes/bookingsRoute')
const cors = require("cors");

app.use(express.json())

app.use("/api/rooms", roomsRoute)
app.use("/api/users", usersRoute)
app.use("/api/bookings", bookingsRoute)
app.use(cors({
    origin: ["http://localhost:3000", "https://hotel-capital-frontend.onrender.com"],
}))
app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.send("API is running..");
})

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Node server started using nodemon"));



