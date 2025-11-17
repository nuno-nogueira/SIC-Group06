const express = require("express");
const swaggerUi = require("swagger-ui-express"); 
const swaggerFile = require("../users-service/swagger-output.json"); 
const jwt = require('jsonwebtoken');
const pino = require("pino");
require('dotenv').config();

const app = express();

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {colorize: true}
  }
}) 

// Middlewares
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));


// Routes
const cart_routes = require("./routes/users.routes.js");
app.use(cart_routes);

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST;
app.listen(PORT, () => logger.info(`Users service running on http://${HOST}:${PORT}/`));