"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.configVariables = exports.ConfigVariable = void 0;
const model_1 = require("../model");
const sql_1 = require("./sql");
var ConfigVariable;
(function (ConfigVariable) {
    ConfigVariable["SupportNoCategoryVideo"] = "SUPPORT_NO_CATEGORY_VIDEOS";
    ConfigVariable["SupportNewCategories"] = "SUPPORT_NEW_CATEGORIES";
    ConfigVariable["KillSwitch"] = "KILL_SWITCH_ON";
    ConfigVariable["VideoViewPerUserTimeLimit"] = "VIDEO_VIEW_PER_USER_TIME_LIMIT";
    ConfigVariable["VideoRelevanceViewsTick"] = "VIDEO_RELEVANCE_VIEWS_TICK";
    ConfigVariable["RelevanceWeights"] = "RELEVANCE_WEIGHTS";
    ConfigVariable["AppPrivateKey"] = "APP_PRIVATE_KEY";
    ConfigVariable["SessionExpiryAfterInactivityMinutes"] = "SESSION_EXPIRY_AFTER_INACTIVITY_MINUTES";
    ConfigVariable["SessionMaxDurationHours"] = "SESSION_MAX_DURATION_HOURS";
    ConfigVariable["SendgridApiKey"] = "SENDGRID_API_KEY";
    ConfigVariable["SendgridFromEmail"] = "SENDGRID_FROM_EMAIL";
    ConfigVariable["AppName"] = "APP_NAME";
    ConfigVariable["EmailConfirmationRoute"] = "EMAIL_CONFIRMATION_ROUTE";
    ConfigVariable["EmailConfirmationTokenExpiryTimeHours"] = "EMAIL_CONFIRMATION_TOKEN_EXPIRY_TIME_HOURS";
    ConfigVariable["EmailConfirmationTokenRateLimit"] = "EMAIL_CONFIRMATION_TOKEN_RATE_LIMIT";
    ConfigVariable["AccountOwnershipProofExpiryTimeSeconds"] = "ACCOUNT_OWNERSHIP_PROOF_EXPIRY_TIME_SECONDS";
})(ConfigVariable = exports.ConfigVariable || (exports.ConfigVariable = {}));
const boolType = {
    serialize: (v) => (v ? '1' : '0'),
    deserialize: (v) => v === 'true' || v === '1',
};
const intType = {
    serialize: (v) => v.toString(),
    deserialize: (v) => parseInt(v),
};
const stringType = {
    serialize: (v) => v,
    deserialize: (v) => v,
};
const jsonType = () => ({
    serialize: (v) => JSON.stringify(v),
    deserialize: (v) => JSON.parse(v),
});
exports.configVariables = {
    [ConfigVariable.SupportNoCategoryVideo]: boolType,
    [ConfigVariable.SupportNewCategories]: boolType,
    [ConfigVariable.KillSwitch]: boolType,
    [ConfigVariable.VideoViewPerUserTimeLimit]: intType,
    [ConfigVariable.VideoRelevanceViewsTick]: intType,
    [ConfigVariable.RelevanceWeights]: jsonType(),
    [ConfigVariable.AppPrivateKey]: stringType,
    [ConfigVariable.SessionMaxDurationHours]: intType,
    [ConfigVariable.SessionExpiryAfterInactivityMinutes]: intType,
    [ConfigVariable.SendgridApiKey]: stringType,
    [ConfigVariable.SendgridFromEmail]: stringType,
    [ConfigVariable.AppName]: stringType,
    [ConfigVariable.EmailConfirmationRoute]: stringType,
    [ConfigVariable.EmailConfirmationTokenExpiryTimeHours]: intType,
    [ConfigVariable.AccountOwnershipProofExpiryTimeSeconds]: intType,
    [ConfigVariable.EmailConfirmationTokenRateLimit]: intType,
};
class Config {
    async get(name, em) {
        const serialized = await (0, sql_1.withHiddenEntities)(em, async () => {
            return (await em.findOneBy(model_1.GatewayConfig, { id: name }))?.value ?? process.env[name];
        });
        if (serialized === undefined) {
            throw new Error(`Cannot determine value of config variable ${name}`);
        }
        return exports.configVariables[name].deserialize(serialized);
    }
    async set(name, value, em) {
        const serialize = exports.configVariables[name].serialize;
        const configValue = new model_1.GatewayConfig({
            id: name,
            updatedAt: new Date(),
            value: serialize(value),
        });
        await em.save(configValue);
    }
}
exports.config = new Config();
//# sourceMappingURL=config.js.map