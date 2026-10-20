import path from "path";

import colors from "colors";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf } = format;

// Clean, styled console logging format
const consoleFormat = printf((info: Record<string, unknown>) => {
  const { level, message, timestamp } = info;
  const date = new Date(timestamp as string | number | Date);
  const timeStr = date.toLocaleTimeString("en-GB", { hour12: false });

  let badge = colors.cyan.bold(" INFO  ");
  if (level === "error") badge = colors.red.bold(" ERROR ");
  else if (level === "warn") badge = colors.yellow.bold(" WARN  ");
  else if (level === "debug") badge = colors.magenta.bold(" DEBUG ");

  return `${colors.gray(`[${timeStr}]`)} ${badge} ${colors.gray("│")} ${message}`;
});

// Plain-text format for disk log rotation (strips ANSI color escapes)
const fileFormat = printf((info: Record<string, unknown>) => {
  const { level, message, timestamp } = info;
  const date = new Date(timestamp as string | number | Date);
  const cleanMessage =
    typeof message === "string" ? colors.strip(message) : message;
  return `${date.toISOString()} [${String(level).toUpperCase()}]: ${cleanMessage}`;
});

const logger = createLogger({
  level: "info",
  transports: [
    new transports.Console({
      format: combine(timestamp(), consoleFormat)
    }),
    new DailyRotateFile({
      format: combine(timestamp(), fileFormat),
      filename: path.join(process.cwd(), "winston", "success", "%DATE%-success.log"),
      datePattern: "DD-MM-YYYY-HH",
      maxSize: "20m",
      maxFiles: "1d"
    })
  ]
});

const errorLogger = createLogger({
  level: "error",
  transports: [
    new transports.Console({
      format: combine(timestamp(), consoleFormat)
    }),
    new DailyRotateFile({
      format: combine(timestamp(), fileFormat),
      filename: path.join(process.cwd(), "winston", "error", "%DATE%-error.log"),
      datePattern: "DD-MM-YYYY-HH",
      maxSize: "20m",
      maxFiles: "1d"
    })
  ]
});

export { errorLogger, logger };
