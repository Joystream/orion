"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEmailData = void 0;
const handlebars_1 = require("handlebars");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const registerEmailContent = (0, handlebars_1.compile)(fs_1.default.readFileSync(path_1.default.join(__dirname, './templates/register.html.mst')).toString());
function registerEmailData(templateData) {
    return {
        subject: `Welcome to ${templateData.appName}!`,
        content: registerEmailContent(templateData),
    };
}
exports.registerEmailData = registerEmailData;
//# sourceMappingURL=index.js.map