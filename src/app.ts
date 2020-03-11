#!/usr/bin/env node
import { configure, Log4js } from "log4js";
import { NodeIpcServer } from "./NodeIpcServer";
import { setInterval } from "timers";

const nameOrPort = process.env.IPC_CHANNEL || "DOTUP-IPC-SERVER";

// vars
let prefix = "production";
let logger: Log4js | undefined;

if (process.env.NODE_ENV !== undefined) {
  prefix = process.env.NODE_ENV;
}


const initialize = async () => {
  // IPC Server
  try {
    const ipcServer = new NodeIpcServer();
    await ipcServer.initialize(nameOrPort);
    ipcServer.start();

    const timer = setInterval(
      () => console.log(`NodeIpcServer: ${nameOrPort}`),
      60 * 1000
    );

    const exitApp = () => {
      ipcServer?.stop();
      logger?.shutdown(e => console.log(e));
      logger = undefined;
      clearInterval(timer);
      process.off("SIGINT", exitApp);
      process.off("SIGTERM", exitApp);
      process.off("uncaughtException", exitApp);
      process.exit(0);
    };

    process.on("SIGINT", exitApp);
    process.on("SIGTERM", exitApp);
    process.on("uncaughtException", exitApp);

  } catch (error) {
    console.error(error);
  }
};

logger = configure(`${__dirname}/assets/logging.${prefix}.json`);
initialize();
