import winston, { format } from "winston";
import chalk from "chalk";

const colorLevel = (level) => {
  if (level === "INFO") return chalk.greenBright(level);
  if (level === "DEBUG") return chalk.blueBright(level);
  if (level === "WARN") return chalk.yellowBright(level);
  if (level === "ERROR") return chalk.redBright(level);
  return level;
};

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp, tag }) => {
    // tag = tag || "SYSTEM";
    tag = chalk.bgMagenta.cyan(tag || "SYSTEM");
    const levelUppercase = level.toUpperCase();
    const levelColor = colorLevel(levelUppercase);
    return `${timestamp}\t${levelColor}\t${tag}\t${message}`;
  })
);
const logger = winston.createLogger({
  // const levels = {
  //     error: 0,
  //     warn: 1,
  //     info: 2,
  //     http: 3,
  //     verbose: 4,
  //     debug: 5,
  //     silly: 6
  //   };
  level: "info", //sẽ ghi tất cả level từ info trở lên ở trang chủ winston
  format: winston.format.json(), //ghi log với dạng json
  defaultMeta: { tag: "SYSTEM" },

  // nơi thiết lập log đến (console, file, ...)
  transports: [
    // Console
    new winston.transports.Console({ format: consoleFormat }),

    // chỉ ghi log là error vào file error.log
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),

    // ghi tất cả log vào file combined.log
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
