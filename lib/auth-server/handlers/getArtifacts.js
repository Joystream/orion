"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArtifacts = void 0;
const errors_1 = require("../errors");
const globalEm_1 = require("../../utils/globalEm");
const model_1 = require("../../model");
const getArtifacts = async (req, res, next) => {
    try {
        const em = await globalEm_1.globalEm;
        const { id, email } = req.query;
        const artifacts = await em
            .getRepository(model_1.EncryptionArtifacts)
            .createQueryBuilder('ea')
            .select('ea')
            .innerJoin('ea.account', 'a', 'a.email = :email', { email })
            .where('ea.id = :id', { id })
            .getOne();
        if (!artifacts) {
            throw new errors_1.NotFoundError('Artifacts not found by provided id (lookupKey)');
        }
        const { cipherIv, encryptedSeed } = artifacts;
        res.status(200).json({
            id,
            cipherIv,
            encryptedSeed,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.getArtifacts = getArtifacts;
//# sourceMappingURL=getArtifacts.js.map