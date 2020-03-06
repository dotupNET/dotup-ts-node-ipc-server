import { IpcServer } from "@dotup/node-ipc";
// tslint:disable-next-line: match-default-export-name
import enquirer from "enquirer";
import { configure, getLogger } from "log4js";

const logger = getLogger("IPC");

export class NodeIpcServer {

  private channelName: string;

  private ipcServer: IpcServer | undefined;

  async initialize(nameOrPort: string): Promise<void> {

    this.channelName = nameOrPort;

    const answer = await enquirer.prompt<{ channelName: string }>({
      type: "input",
      name: "channelName",
      message: "Enter channel name or port",
      initial: this.channelName,
      skip: nameOrPort !== undefined
    });

    this.channelName = answer.channelName;

    logger.info(`Channel name or port: '${this.channelName}'`);
  }

  start(): void {

    if (this.ipcServer !== undefined) {
      logger.warn("this.ipcServer !== undefined");
      return;
    }
    this.ipcServer = new IpcServer(this.channelName);
    this.ipcServer.start();

    this.ipcServer.on("error", e => logger.error(e));
  }

  stop(): void {
    this.ipcServer?.stop();
    this.ipcServer?.removeAllListeners();
    this.ipcServer = undefined;
  }

}
