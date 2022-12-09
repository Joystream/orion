"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOnly = exports.AccountOnly = exports.OperatorOnly = void 0;
const OperatorOnly = async ({ context }, next) => {
    if (!context?.user.isRoot) {
        throw new Error('Unauthorized: Root access required');
    }
    return next();
};
exports.OperatorOnly = OperatorOnly;
const AccountOnly = async ({ context }, next) => {
    if (!context?.account) {
        throw new Error('Unauthorized: Account required');
    }
    return next();
};
exports.AccountOnly = AccountOnly;
const UserOnly = async ({ context }, next) => {
    if (!context?.user) {
        throw new Error('Unauthorized: User required');
    }
    return next();
};
exports.UserOnly = UserOnly;
//# sourceMappingURL=middleware.js.map