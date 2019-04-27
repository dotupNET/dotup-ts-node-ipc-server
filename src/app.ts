#!/usr/bin/env node
import commander from 'commander';
import { configure } from 'log4js';
import { NodeIpcServer } from './NodeIpcServer';
import { setInterval } from 'timers';

// logging
let prefix = 'production';

if (process.env.NODE_ENV !== undefined) {
  prefix = process.env.NODE_ENV;
}

configure(`${__dirname}/assets/logging.${prefix}.json`);

// Command line arguments
let nameOrPort: string = process.env.IPC_CHANNEL;

const args = commander
  .option('-c, --channel <IpcNameOrPort>', 'IPC Channel name or port')
  .parse(process.argv);

if (args.channel !== undefined) {
  nameOrPort = <string>args.channel;
}

// IPC Server
const ipcServer = new NodeIpcServer();
ipcServer
  .initialize(nameOrPort)
  .then(() => ipcServer.start())
  .catch(e => console.error(e))
  ;

const timer = setInterval(
  () => console.log(`NodeIpcServer: ${nameOrPort}`),
  60 * 1000
)

process.on('SIGINT', () => {
  ipcServer.stop();
  process.exit(0);
});

process.on('uncaughtException', () => {
  try {
    ipcServer.stop();
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(1001);
  }
});
