const pino = require("pino");
const jwt = require('jsonwebtoken');
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {colorize: true}
  }
}) 

let menus = []
