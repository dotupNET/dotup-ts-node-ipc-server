#!/usr/bin/env node
import commander from 'commander';
import { configure } from 'log4js';
import { NodeIpcServer } from './NodeIpcServer';

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
