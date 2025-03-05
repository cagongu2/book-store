const express = require("express");
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}))
 
const bookRoutes = require('./src/books/book.route');
const orderRoutes = require('./src/orders/order.route');
const userRoutes = require('./src/users/user.router');
const adminRoutes = require("./src/stats/admin.stats")


app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/admin", adminRoutes)

async function main() {
    await mongoose.connect(process.env.DB_URL);
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
}

main().then(() => console.log("Mongodb connect successfully!")).catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Example 1 app listening on port ${port}`)
})