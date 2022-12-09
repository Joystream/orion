"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class DefaultLogger {
    info(message, ...args) {
        console.log(message, ...args);
    }
    debug(message, ...args) {
        console.log(message, ...args);
    }
    warn(message, ...args) {
        console.warn(message, ...args);
    }
    error(message, ...args) {
        console.error(message, ...args);
    }
}
class Logger {
    static set(impl) {
        Logger.implementation = impl;
    }
    static get() {
        return Logger.implementation;
    }
}
exports.Logger = Logger;
Logger.implementation = new DefaultLogger();
//# sourceMappingURL=logger.js.map