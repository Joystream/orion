"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const logger_1 = require("@subsquid/logger");
const mailerLogger = (0, logger_1.createLogger)('mailer');
if (process.env.SENDGRID_API_KEY) {
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    mailerLogger.info('Sendgrid API initialized using SENDGRID_API_KEY');
}
else {
    mailerLogger.warn('SENDGRID_API_KEY not set, running in debug-only mode...');
}
async function sendMail({ from, to, subject, content }) {
    if (!process.env.SENDGRID_API_KEY) {
        mailerLogger.info(`Skipped sending e-mail:\n${JSON.stringify({ from, to, subject, content }, null, 2)}`);
        return;
    }
    await mail_1.default.send({
        from,
        to,
        subject,
        html: content,
    });
    mailerLogger.info(`E-mail sent:\n${JSON.stringify({ from, to, subject, content }, null, 2)}`);
}
exports.sendMail = sendMail;
//# sourceMappingURL=mail.js.map