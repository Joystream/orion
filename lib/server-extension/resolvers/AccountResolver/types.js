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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountData = exports.FollowedChannel = void 0;
const type_graphql_1 = require("type-graphql");
let FollowedChannel = class FollowedChannel {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], FollowedChannel.prototype, "channelId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], FollowedChannel.prototype, "timestamp", void 0);
FollowedChannel = __decorate([
    (0, type_graphql_1.ObjectType)()
], FollowedChannel);
exports.FollowedChannel = FollowedChannel;
let AccountData = class AccountData {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], AccountData.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], AccountData.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], AccountData.prototype, "joystreamAccount", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: false }),
    __metadata("design:type", Boolean)
], AccountData.prototype, "isEmailConfirmed", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], AccountData.prototype, "membershipId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [FollowedChannel], { nullable: false }),
    __metadata("design:type", Array)
], AccountData.prototype, "followedChannels", void 0);
AccountData = __decorate([
    (0, type_graphql_1.ObjectType)()
], AccountData);
exports.AccountData = AccountData;
//# sourceMappingURL=types.js.map