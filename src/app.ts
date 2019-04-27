#!/usr/bin/env node
import commander from 'commander';
import { NodeIpcServer } from './NodeIpcServer';

const ipcServer = new NodeIpcServer();

let nameOrPort: string = process.env.IPC_CHANNEL;

const args = commander
  .option('-c, --channel <IpcNameOrPort>', 'IPC Channel name or port')
  .parse(process.argv);

if (args.channel !== undefined) {
  nameOrPort = <string>args.channel;
}

ipcServer
  .initialize(nameOrPort)
  .then(() => ipcServer.start())
  .catch(e => console.error(e))
  ;
