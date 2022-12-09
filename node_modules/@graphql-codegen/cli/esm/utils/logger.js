import { dummyLogger } from 'ts-log';
let logger;
export function getLogger() {
    return logger || dummyLogger;
}
useWinstonLogger();
export function setLogger(newLogger) {
    logger = newLogger;
}
export function setSilentLogger() {
    logger = dummyLogger;
}
export function useWinstonLogger() {
    if (logger === null || logger === void 0 ? void 0 : logger.levels) {
        return;
    }
    logger = console;
}
