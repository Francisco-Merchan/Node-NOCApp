import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

export interface CheckServiceMultipleUseCase {
  execute(url: string): Promise<boolean>;
}

type SuccessCallBack = (() => void) | undefined;
type ErrorCallBack = ((error: string) => void) | undefined;

export class CheckServiceMultiple implements CheckServiceMultipleUseCase {
  constructor(
    private readonly logRepository: LogRepository[],
    private readonly successCallback: SuccessCallBack,
    private readonly errorCallback: ErrorCallBack
  ) {}

  private callLogs(log: LogEntity) {
    this.logRepository.forEach((logRepository) => {
      logRepository.saveLog(log);
    });
  }

  public async execute(url: string): Promise<boolean> {
    try {
      const req = await fetch(url);
      if (!req.ok) throw new Error(`Error on check service ${url}`);
      this.callLogs(
        new LogEntity({
          message: `Service ${url} working`,
          level: LogSeverityLevel.low,
          origin: "check-servise.ts",
        })
      );
      this.successCallback && this.successCallback();
      return true;
    } catch (error) {
      this.callLogs(
        new LogEntity({
          message: `${error}`,
          level: LogSeverityLevel.high,
          origin: "check-service.ts",
        })
      );
      this.errorCallback && this.errorCallback(`${error}`);
      return false;
    }
  }
}
