
require("dotenv").config();

const cityRoutes = require("./routes/cityRoutes");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database");
const logger = require("./middlewares/logger");
const {
    errorHandler,
    notFound
} = require("./middlewares/errorHandler");

const busRouteRoutes = require("./routes/busRouteRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
    res.json({
        message: "RESTful API Rute Bus",
        database: "MongoDB"
    });
});

app.use("/cities", cityRoutes);
app.use("/bus-routes", busRouteRoutes);

app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });
    });
}

module.exports = app;
