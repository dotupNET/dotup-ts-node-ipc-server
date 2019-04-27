import { IpcServer } from 'dotup-ts-node-ipc';
// tslint:disable-next-line: match-default-export-name
import enquirer from 'enquirer';
import { configure, getLogger } from 'log4js';

const logger = getLogger('IPC');

export class NodeIpcServer {

  private channelName: string;

  private ipcServer: IpcServer;

  constructor() {
    let prefix = 'production';

    if (process.env.NODE_ENV !== undefined) {
      prefix = process.env.NODE_ENV;
    }

    configure(`${__dirname}/assets/logging.${prefix}.json`);
  }

  async initialize(nameOrPort: string): Promise<void> {

    this.channelName = nameOrPort;

    const answer = await enquirer.prompt<{ channelName: string }>({
      type: 'input',
      name: 'channelName',
      message: 'Enter channel name or port',
      initial: this.channelName,
      skip: nameOrPort !== undefined
    });

    this.channelName = answer.channelName;

    logger.info(`Channel name or port: '${this.channelName}'`);
  }

  start(): void {

    this.ipcServer = new IpcServer(this.channelName);
    this.ipcServer.start();

  }

}
