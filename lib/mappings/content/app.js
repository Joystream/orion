"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processUpdateAppMessage = exports.processCreateAppMessage = void 0;
const metadata_protobuf_1 = require("@joystream/metadata-protobuf");
const utils_1 = require("@joystream/metadata-protobuf/utils");
const model_1 = require("../../model");
const utils_2 = require("../utils");
async function processCreateAppMessage(overlay, blockNumber, indexInBlock, decodedMessage, memberId) {
    const { name, appMetadata } = decodedMessage;
    const appId = `${blockNumber}-${indexInBlock}`;
    const appExists = await overlay.getRepository(model_1.App).getOneBy({ name });
    if (appExists) {
        return (0, utils_2.metaprotocolTransactionFailure)(metadata_protobuf_1.CreateApp, `App with this name already exists: ${name}`, {
            decodedMessage,
        });
    }
    overlay.getRepository(model_1.App).new({
        name,
        id: appId,
        ownerMemberId: memberId,
        websiteUrl: appMetadata?.websiteUrl || undefined,
        useUri: appMetadata?.useUri || undefined,
        smallIcon: appMetadata?.smallIcon || undefined,
        mediumIcon: appMetadata?.mediumIcon || undefined,
        bigIcon: appMetadata?.bigIcon || undefined,
        oneLiner: appMetadata?.oneLiner || undefined,
        description: appMetadata?.description || undefined,
        termsOfService: appMetadata?.termsOfService || undefined,
        platforms: appMetadata?.platforms || undefined,
        category: appMetadata?.category || undefined,
        authKey: appMetadata?.authKey || undefined,
    });
    return new model_1.MetaprotocolTransactionResultOK();
}
exports.processCreateAppMessage = processCreateAppMessage;
async function processUpdateAppMessage(overlay, decodedMessage, memberId) {
    const { appId, appMetadata } = decodedMessage;
    const app = await overlay.getRepository(model_1.App).getById(appId);
    if (!app) {
        return (0, utils_2.metaprotocolTransactionFailure)(metadata_protobuf_1.UpdateApp, `App doesn't exists: ${appId}`, {
            decodedMessage,
        });
    }
    if (app.ownerMemberId !== memberId) {
        return (0, utils_2.metaprotocolTransactionFailure)(metadata_protobuf_1.UpdateApp, `Cannot update app; app does not belong to the member: ${memberId}`, { decodedMessage, memberId });
    }
    if (appMetadata) {
        (0, utils_1.integrateMeta)(app, appMetadata, [
            'websiteUrl',
            'useUri',
            'smallIcon',
            'mediumIcon',
            'bigIcon',
            'oneLiner',
            'description',
            'termsOfService',
            'platforms',
            'category',
            'authKey',
        ]);
    }
    return new model_1.MetaprotocolTransactionResultOK();
}
exports.processUpdateAppMessage = processUpdateAppMessage;
//# sourceMappingURL=app.js.map