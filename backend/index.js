const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require('./src/middleware/errorHandler');

const mongoose = require("mongoose");
require('dotenv').config();

const env = require('./src/config/env');
const port = env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [env.CLIENT_URL],
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

const seedDefaultAdmin = require('./src/utils/seedAdmin');

async function main() {
    await mongoose.connect(env.DB_URL);
    await seedDefaultAdmin();
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
}

main().then(() => console.log("Mongodb connect successfully!")).catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Example 1 app listening on port ${port}`)
})