"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = void 0;
const errors_1 = require("../errors");
const globalEm_1 = require("../../utils/globalEm");
const model_1 = require("../../model");
const misc_1 = require("../../utils/misc");
const utils_1 = require("../utils");
const createAccount = async (req, res, next) => {
    try {
        const { payload: { email, memberId, joystreamAccountId }, } = req.body;
        const { authContext } = res.locals;
        const em = await globalEm_1.globalEm;
        if (authContext?.account) {
            throw new errors_1.BadRequestError('Already logged in to an account.');
        }
        await (0, utils_1.verifyActionExecutionRequest)(em, req.body);
        await em.transaction(async (em) => {
            // Get and lock next account id
            // FIXME: For some reason this doesn't work as expected without the parseInt!
            // (returns `nextId` as a string instead of a number)
            const nextAccountId = parseInt((await em
                .getRepository(model_1.NextEntityId)
                .findOne({ where: { entityName: 'Account' }, lock: { mode: 'pessimistic_write' } }))?.nextId.toString() || '1');
            const existingByEmail = await em.getRepository(model_1.Account).findOneBy({ email });
            if (existingByEmail) {
                throw new errors_1.ConflictError('Account with the provided e-mail address already exists.');
            }
            const existingByMemberId = await em
                .getRepository(model_1.Account)
                .findOneBy({ membershipId: memberId });
            if (existingByMemberId) {
                throw new errors_1.ConflictError('Account with the provided member id already exists.');
            }
            const existingByJoystreamAccountId = await em
                .getRepository(model_1.Account)
                .findOneBy({ joystreamAccount: joystreamAccountId });
            if (existingByJoystreamAccountId) {
                throw new errors_1.ConflictError('Account with the provided joystream account address already exists.');
            }
            const membership = await em.getRepository(model_1.Membership).findOneBy({ id: memberId });
            if (!membership) {
                throw new errors_1.NotFoundError(`Membership not found by id: ${memberId}`);
            }
            if (membership.controllerAccount !== joystreamAccountId) {
                throw new errors_1.BadRequestError(`Provided joystream account address doesn't match the controller account of the provided membership.`);
            }
            const account = new model_1.Account({
                id: (0, misc_1.idStringFromNumber)(nextAccountId),
                email,
                isEmailConfirmed: false,
                registeredAt: new Date(),
                isBlocked: false,
                userId: authContext?.user.id,
                joystreamAccount: joystreamAccountId,
                membershipId: memberId.toString(),
            });
            await em.save([
                account,
                new model_1.NextEntityId({ entityName: 'Account', nextId: nextAccountId + 1 }),
            ]);
            if (req.body.payload.encryptionArtifacts) {
                const { cipherIv, encryptedSeed, id: lookupKey } = req.body.payload.encryptionArtifacts;
                // We don't check if artifacts already exist by this id, becasue that opens up
                // a brute-force attack vector. Instead, in this case the existing artifacts will
                // be overwritten.
                const encryptionArtifacts = new model_1.EncryptionArtifacts({
                    id: lookupKey,
                    accountId: account.id,
                    cipherIv,
                    encryptedSeed,
                });
                await em.save(encryptionArtifacts);
            }
        });
        res.status(200).json({ success: true });
    }
    catch (e) {
        next(e);
    }
};
exports.createAccount = createAccount;
//# sourceMappingURL=createAccount.js.map