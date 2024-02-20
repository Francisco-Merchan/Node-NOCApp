import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

export interface CheckServiceUseCase {
  execute(url: string): Promise<boolean>;
}

type SuccessCallBack = (() => void) | undefined;
type ErrorCallBack = ((error: string) => void) | undefined;

export class CheckService implements CheckServiceUseCase {
  constructor(
    private readonly logRepository: LogRepository,
    private readonly successCallback: SuccessCallBack,
    private readonly errorCallback: ErrorCallBack
  ) {}

  public async execute(url: string): Promise<boolean> {
    try {
      const req = await fetch(url);
      if (!req.ok) throw new Error(`Error on check service ${url}`);
      this.logRepository.saveLog(
        new LogEntity({
          message: `Service ${url} working`,
          level: LogSeverityLevel.low,
          origin: "check-servise.ts",
        })
      );
      this.successCallback && this.successCallback();
      return true;
    } catch (error) {
      this.logRepository.saveLog(
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
