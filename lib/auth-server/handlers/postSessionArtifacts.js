"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSessionArtifacts = void 0;
const globalEm_1 = require("../../utils/globalEm");
const model_1 = require("../../model");
const crypto_1 = require("../../utils/crypto");
const errors_1 = require("../errors");
const postSessionArtifacts = async (req, res, next) => {
    try {
        const { authContext: session } = res.locals;
        const em = await globalEm_1.globalEm;
        if (!session?.id) {
            throw new errors_1.UnauthorizedError('Cannot save session artifacts for empty session');
        }
        const existingArtifacts = await em
            .getRepository(model_1.SessionEncryptionArtifacts)
            .findOneBy({ sessionId: session.id });
        if (!session?.account) {
            throw new errors_1.UnauthorizedError('Cannot save session artifacts for anonymous session');
        }
        if (existingArtifacts) {
            throw new errors_1.ConflictError('Session artifacts already saved');
        }
        const { cipherKey, cipherIv } = req.body;
        const sessionEncryptionArtifacts = new model_1.SessionEncryptionArtifacts({
            id: (0, crypto_1.uniqueId)(),
            cipherIv,
            cipherKey,
            sessionId: session.id,
        });
        await em.save(sessionEncryptionArtifacts);
        res.status(200).json({ success: true });
    }
    catch (e) {
        next(e);
    }
};
exports.postSessionArtifacts = postSessionArtifacts;
//# sourceMappingURL=postSessionArtifacts.js.map