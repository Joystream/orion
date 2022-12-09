"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAgentData = void 0;
const ua_parser_js_1 = require("ua-parser-js");
function getUserAgentData(req) {
    const uaParsed = new ua_parser_js_1.UAParser(req.headers['user-agent']);
    return {
        browser: `${uaParsed.getBrowser().name} ${uaParsed.getBrowser().version}`,
        device: `${uaParsed.getDevice().vendor} ${uaParsed.getDevice().model}`,
        os: `${uaParsed.getOS().name} ${uaParsed.getOS().version}`,
        deviceType: uaParsed.getDevice().type,
    };
}
exports.getUserAgentData = getUserAgentData;
//# sourceMappingURL=http.js.map