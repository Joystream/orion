"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionArtifacts = void 0;
const errors_1 = require("../errors");
const globalEm_1 = require("../../utils/globalEm");
const model_1 = require("../../model");
const getSessionArtifacts = async (req, res, next) => {
    try {
        const em = await globalEm_1.globalEm;
        const { authContext: session } = res.locals;
        if (!session?.account) {
            throw new errors_1.UnauthorizedError('Cannot get session artifacts for anonymous session');
        }
        const artifacts = await em
            .getRepository(model_1.SessionEncryptionArtifacts)
            .findOneBy({ sessionId: session.id });
        if (!artifacts) {
            throw new errors_1.NotFoundError('Encryption artifacts assiocated with the current session not found');
        }
        const { cipherIv, cipherKey } = artifacts;
        res.status(200).json({ cipherIv, cipherKey });
    }
    catch (e) {
        next(e);
    }
};
exports.getSessionArtifacts = getSessionArtifacts;
//# sourceMappingURL=getSessionArtifacts.js.map