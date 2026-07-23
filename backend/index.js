const express = require("express");
const app = express();
const cors = require("cors");
const errorHandler = require('./src/middleware/errorHandler');

const mongoose = require("mongoose");
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}))
 
const bookRoutes = require('./src/books/book.route');
const orderRoutes = require('./src/orders/order.route');
const userRoutes = require('./src/users/user.router');
const adminRoutes = require("./src/stats/admin.stats")
const customerRoutes = require('./src/customers/customer.route');
const cartRoutes = require('./src/cart/cart.route');
const categoryRoutes = require('./src/categories/category.route');

app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/carts", cartRoutes);
app.use("/api/v1/categories", categoryRoutes);

// Swagger setup
const { swaggerUi, specs } = require('./src/config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Add global error handler at the end
app.use(errorHandler);

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