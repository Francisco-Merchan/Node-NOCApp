import { CheckService } from "../domain/use-cases/checks/check-service";
import { CheckServiceMultiple } from "../domain/use-cases/checks/check-service-multiple";
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { MongoLogDataSource } from "../infrastructure/datasources/mongo-log.datasource";
import { PostgresLogDatasource } from "../infrastructure/datasources/postgres-log.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email-service";

const logRepository = new LogRepositoryImpl(
  // new FileSystemDatasource()
  // new MongoLogDataSource()
  new PostgresLogDatasource()
);
const fsLogRepository = new LogRepositoryImpl(new FileSystemDatasource());

const mongoLogRepository = new LogRepositoryImpl(new MongoLogDataSource());

const postresLogRepository = new LogRepositoryImpl(new PostgresLogDatasource());

const emailService = new EmailService();

export class Server {
  static start() {
    console.log("Server started...");

    //--------------Enviar Email-----------

    // const emailService = new EmailService();

    // emailService.sendEmail({
    //   to: "merchanf6@gmail.com",
    //   subject: "Logs de sistema",
    //   htmlBody: `<h3>Logs de NOC</h3>`,
    // });

    // emailService.sendEmailWithFileSystemLogs(["merchanf6@gmail.com"]);

    // ENVIAR EMAIL A TRAVEZ DE UN CASO DE USO
    // new SendEmailLogs(emailService, logRepository).execute([
    //   "merchanf6@gmail.com",
    // ]);
    //----------------------------------------

    // CronService.createJob("*/5 * * * * *", () => {
    //   new CheckService(
    //     logRepository,
    //     () => console.log("Success"),
    //     (error) => console.log(error)
    //   ).execute(`https://gooegergerregle.com`);
    //   // new CheckService().execute(`http://localhost:3000/posts`);
    // });

    CronService.createJob("*/5 * * * * *", () => {
      new CheckServiceMultiple(
        [fsLogRepository, mongoLogRepository, postresLogRepository],
        () => console.log("Success"),
        (error) => console.log(error)
      ).execute(`https://gooegergerregle.com`);
      // new CheckService().execute(`http://localhost:3000/posts`);
    });
  }
}
