import {createLogger, format, Logger as WinstonLogger, transports} from "winston";
import * as fs from "fs";

const LOGS_PATH : string = "logs"

class Logger {
    private readonly _infoLogger : WinstonLogger
    private readonly _errorLogger : WinstonLogger
    private readonly _requestLogger : WinstonLogger

    constructor() {
        if (!fs.existsSync(LOGS_PATH)){
            fs.mkdirSync(LOGS_PATH);
        }

        this._infoLogger = createLogger({
            level : 'info',
            format : format.combine(
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                format.json()
            ),
            transports: [
                new transports.Console(),
                new transports.File({filename : LOGS_PATH +'/info.log'})
            ]
        });

        this._errorLogger = createLogger({
            handleExceptions : true,
            level : 'error',
            format : format.combine(
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                format.json()
            ),
            transports: [
                new transports.Console(),
                new transports.File({filename : LOGS_PATH +'/errors.log'})
            ]
        });

        this._requestLogger = createLogger({
            handleExceptions : true,
            level : 'info',
            format : format.combine(
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                format.json()
            ),
            transports: [
                new transports.Console(),
                new transports.File({filename : LOGS_PATH +'/requests.log'})
            ]
        });
    }

    logInfo(info : any) : void {
        this._infoLogger.info(info);
    }

    logError(error : any, ...meta: any[]) : void {
        this._errorLogger.error(error, meta)
    }

    logRequest(request : any) : void {
        this._requestLogger.info(request);
    }

}

export default new Logger();