const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, colorize } = format;

let logger;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

logger = createLogger({
  format: combine(
    label({ label: "Toll System" }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    myFormat
  ),
  transports: [
    new transports.Console({
      level: "info",
      format: combine(colorize({ all: true }), myFormat)
    }),
    new transports.File({
      filename: "app-log.log",
      level: "error",
      format: myFormat
    })
  ],
  defaultMeta: {
    service: "user-service"
  }
});

// eslint-disable-next-line no-undef
process.on("unhandledRejection", ex => {
  throw ex;
});

// eslint-disable-next-line no-undef
process.on("uncaughtException", ex => {
  logger.error(`${ex.stack}`);
  // eslint-disable-next-line no-undef
  process.exit();
});

module.exports = logger;
