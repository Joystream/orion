"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountResolver = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const middleware_1 = require("../middleware");
const types_1 = require("./types");
const assert_1 = __importDefault(require("assert"));
const sql_1 = require("../../../utils/sql");
const model_1 = require("../../../model");
let AccountResolver = class AccountResolver {
    // Set by depenency injection
    constructor(em) {
        this.em = em;
    }
    async accountData(info, ctx) {
        const account = ctx.account;
        const em = await this.em();
        (0, assert_1.default)(account, 'Unexpected context: account is not set');
        const { id, email, joystreamAccount, membershipId, isEmailConfirmed } = account;
        let followedChannels = [];
        if (info.fieldNodes[0].selectionSet?.selections.some((s) => s.kind === 'Field' && s.name.value === 'followedChannels')) {
            followedChannels = await (0, sql_1.withHiddenEntities)(em, async () => {
                const followedChannels = await em
                    .getRepository(model_1.ChannelFollow)
                    .findBy({ userId: account.userId });
                return followedChannels.map(({ channelId, timestamp }) => ({
                    channelId,
                    timestamp: timestamp.toISOString(),
                }));
            });
        }
        return {
            id,
            email,
            joystreamAccount,
            membershipId,
            isEmailConfirmed,
            followedChannels,
        };
    }
};
__decorate([
    (0, type_graphql_1.UseMiddleware)(middleware_1.AccountOnly),
    (0, type_graphql_1.Query)(() => types_1.AccountData),
    __param(0, (0, type_graphql_1.Info)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "accountData", null);
AccountResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], AccountResolver);
exports.AccountResolver = AccountResolver;
//# sourceMappingURL=index.js.map