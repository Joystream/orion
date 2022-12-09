"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const globalEm_1 = require("../../utils/globalEm");
const errors_1 = require("../errors");
const logout = async (req, res, next) => {
    try {
        const { authContext: session } = res.locals;
        if (!session) {
            throw new errors_1.BadRequestError('No session to logout found.');
        }
        const em = await globalEm_1.globalEm;
        session.expiry = new Date();
        await em.save(session);
        res.status(200).json({ success: true });
    }
    catch (e) {
        next(e);
    }
};
exports.logout = logout;
//# sourceMappingURL=logout.js.map