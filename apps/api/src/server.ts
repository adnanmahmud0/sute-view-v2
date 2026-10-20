/* eslint-disable no-console */
import { Server as HttpServer } from "http";
import process from "process";

import colors from "colors";
import { Server } from "socket.io";

import app from "./app";
import config from "./config";
import { seedSuperAdmin } from "./DB/seedAdmin";
import { socketHelper } from "./helpers/socketHelper";
import { errorLogger, logger } from "./shared/logger";
import prisma from "./shared/prisma";

//uncaught exception
process.on("uncaughtException", (error) => {
  errorLogger.error("UnhandleException Detected", error);
  process.exit(1);
});

const printApiBanner = (port: number | string, host: string) => {
  const baseUrl = `http://${host}:${port}`;
  const width = 56;
  const line = "─".repeat(width);

  console.log();
  console.log(colors.cyan.bold(`  ╭${line}╮`));
  console.log(
    colors.cyan.bold("  │  ") +
      colors.bold.white("⚡ EXPRESSTURBO API") +
      colors.gray(" (Express + Prisma ORM)") +
      " ".repeat(width - 43) +
      colors.cyan.bold("│")
  );
  console.log(colors.cyan.bold(`  ├${line}┤`));
  console.log(
    colors.cyan.bold("  │  ") +
      colors.gray("➜") +
      colors.white(" Local:       ") +
      colors.cyan.bold(`${baseUrl}/`) +
      " ".repeat(Math.max(0, width - 15 - `${baseUrl}/`.length)) +
      colors.cyan.bold("│")
  );
  console.log(
    colors.cyan.bold("  │  ") +
      colors.gray("➜") +
      colors.white(" API v1:      ") +
      colors.green.bold(`${baseUrl}/api/v1`) +
      " ".repeat(Math.max(0, width - 15 - `${baseUrl}/api/v1`.length)) +
      colors.cyan.bold("│")
  );
  console.log(
    colors.cyan.bold("  │  ") +
      colors.gray("➜") +
      colors.white(" Swagger UI:  ") +
      colors.yellow.bold(`${baseUrl}/api/docs`) +
      " ".repeat(Math.max(0, width - 15 - `${baseUrl}/api/docs`.length)) +
      colors.cyan.bold("│")
  );
  console.log(
    colors.cyan.bold("  │  ") +
      colors.gray("➜") +
      colors.white(" Environment: ") +
      colors.magenta.bold(`${config.node_env}`) +
      " ".repeat(Math.max(0, width - 15 - `${config.node_env}`.length)) +
      colors.cyan.bold("│")
  );
  console.log(
    colors.cyan.bold("  │  ") +
      colors.gray("➜") +
      colors.white(" Database:    ") +
      colors.blue.bold("PostgreSQL") +
      " ".repeat(Math.max(0, width - 15 - "PostgreSQL".length)) +
      colors.cyan.bold("│")
  );
  console.log(colors.cyan.bold(`  ╰${line}╯`));
  console.log();
};

let server: HttpServer;
async function main() {
  const port = typeof config.port === "number" ? config.port : Number(config.port);
  const host = (config.ip_address as string) || "localhost";

  try {
    server = app.listen(port, host, () => {
      printApiBanner(port, host);
    });

    //socket
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: "*"
      }
    });
    socketHelper.socket(io);
    //@ts-expect-error global io assignment
    global.io = io;

    // Connect to database
    try {
      await prisma.$connect();
      logger.info(colors.green("🚀 Database connected successfully"));

      // Seed Super Admin after database connection is successful
      await seedSuperAdmin();
    } catch (dbError) {
      logger.warn(
        colors.yellow(
          `⚠️  Database connection not established: ${dbError instanceof Error ? dbError.message : "Unreachable"}. Server is listening on port ${port}.`
        )
      );
    }
  } catch (error) {
    errorLogger.error(colors.red("🤢 Failed to initialize Server"), error);
    process.exit(1);
  }

  //handle unhandleRejection
  process.on("unhandledRejection", (error) => {
    if (server) {
      server.close(() => {
        errorLogger.error("UnhandleRejection Detected", error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

//graceful shutdown (docker stop sends SIGTERM; blue/green relies on this)
const shutdown = (signal: string) => {
  logger.info(`${signal} IS RECEIVE`);
  const forceExit = setTimeout(() => process.exit(0), 10_000);
  forceExit.unref();
  const finish = () => {
    prisma
      .$disconnect()
      .catch(() => undefined)
      .finally(() => process.exit(0));
  };
  if (server) {
    server.close(finish);
  } else {
    finish();
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
