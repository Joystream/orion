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
exports.ChannelsSearchArgs = exports.ChannelsSearchResult = exports.ChannelReportInfo = exports.ChannelUnfollowResult = exports.ChannelFollowResult = exports.UnfollowChannelArgs = exports.FollowChannelArgs = exports.ReportChannelArgs = exports.ChannelNftCollectorsArgs = exports.ChannelNftCollectorsOrderByInput = exports.TopSellingChannelsArgs = exports.MostRecentChannelsArgs = exports.ExtendedChannelsArgs = exports.ExtendedChannelWhereInput = exports.ChannelNftCollector = exports.TopSellingChannelsResult = exports.ExtendedChannel = void 0;
const type_graphql_1 = require("type-graphql");
const baseTypes_1 = require("../baseTypes");
const class_validator_1 = require("class-validator");
const commonTypes_1 = require("../commonTypes");
let ExtendedChannel = class ExtendedChannel {
};
__decorate([
    (0, type_graphql_1.Field)(() => baseTypes_1.Channel, { nullable: false }),
    __metadata("design:type", baseTypes_1.Channel)
], ExtendedChannel.prototype, "channel", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], ExtendedChannel.prototype, "activeVideosCount", void 0);
ExtendedChannel = __decorate([
    (0, type_graphql_1.ObjectType)()
], ExtendedChannel);
exports.ExtendedChannel = ExtendedChannel;
let TopSellingChannelsResult = class TopSellingChannelsResult {
};
__decorate([
    (0, type_graphql_1.Field)(() => baseTypes_1.Channel, { nullable: false }),
    __metadata("design:type", baseTypes_1.Channel)
], TopSellingChannelsResult.prototype, "channel", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], TopSellingChannelsResult.prototype, "amount", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], TopSellingChannelsResult.prototype, "nftSold", void 0);
TopSellingChannelsResult = __decorate([
    (0, type_graphql_1.ObjectType)()
], TopSellingChannelsResult);
exports.TopSellingChannelsResult = TopSellingChannelsResult;
let ChannelNftCollector = class ChannelNftCollector {
};
__decorate([
    (0, type_graphql_1.Field)(() => baseTypes_1.Membership, { nullable: false }),
    __metadata("design:type", baseTypes_1.Membership)
], ChannelNftCollector.prototype, "member", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], ChannelNftCollector.prototype, "amount", void 0);
ChannelNftCollector = __decorate([
    (0, type_graphql_1.ObjectType)()
], ChannelNftCollector);
exports.ChannelNftCollector = ChannelNftCollector;
let ExtendedChannelWhereInput = class ExtendedChannelWhereInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => baseTypes_1.ChannelWhereInput, { nullable: true }),
    __metadata("design:type", Object)
], ExtendedChannelWhereInput.prototype, "channel", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ExtendedChannelWhereInput.prototype, "activeVideosCount_gt", void 0);
ExtendedChannelWhereInput = __decorate([
    (0, type_graphql_1.InputType)()
], ExtendedChannelWhereInput);
exports.ExtendedChannelWhereInput = ExtendedChannelWhereInput;
let ExtendedChannelsArgs = class ExtendedChannelsArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => ExtendedChannelWhereInput, { nullable: true }),
    __metadata("design:type", ExtendedChannelWhereInput)
], ExtendedChannelsArgs.prototype, "where", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [baseTypes_1.ChannelOrderByInput], { nullable: true }),
    __metadata("design:type", Array)
], ExtendedChannelsArgs.prototype, "orderBy", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ExtendedChannelsArgs.prototype, "limit", void 0);
ExtendedChannelsArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], ExtendedChannelsArgs);
exports.ExtendedChannelsArgs = ExtendedChannelsArgs;
let MostRecentChannelsArgs = class MostRecentChannelsArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => ExtendedChannelWhereInput, { nullable: true }),
    __metadata("design:type", ExtendedChannelWhereInput)
], MostRecentChannelsArgs.prototype, "where", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [baseTypes_1.ChannelOrderByInput], { nullable: true }),
    __metadata("design:type", Array)
], MostRecentChannelsArgs.prototype, "orderBy", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], MostRecentChannelsArgs.prototype, "mostRecentLimit", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], MostRecentChannelsArgs.prototype, "resultsLimit", void 0);
MostRecentChannelsArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], MostRecentChannelsArgs);
exports.MostRecentChannelsArgs = MostRecentChannelsArgs;
let TopSellingChannelsArgs = class TopSellingChannelsArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => ExtendedChannelWhereInput, { nullable: true }),
    __metadata("design:type", ExtendedChannelWhereInput)
], TopSellingChannelsArgs.prototype, "where", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], TopSellingChannelsArgs.prototype, "limit", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], TopSellingChannelsArgs.prototype, "periodDays", void 0);
TopSellingChannelsArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], TopSellingChannelsArgs);
exports.TopSellingChannelsArgs = TopSellingChannelsArgs;
var ChannelNftCollectorsOrderByInput;
(function (ChannelNftCollectorsOrderByInput) {
    ChannelNftCollectorsOrderByInput[ChannelNftCollectorsOrderByInput["amount_ASC"] = 0] = "amount_ASC";
    ChannelNftCollectorsOrderByInput[ChannelNftCollectorsOrderByInput["amount_DESC"] = 1] = "amount_DESC";
})(ChannelNftCollectorsOrderByInput = exports.ChannelNftCollectorsOrderByInput || (exports.ChannelNftCollectorsOrderByInput = {}));
(0, type_graphql_1.registerEnumType)(ChannelNftCollectorsOrderByInput, {
    name: 'ChannelNftCollectorsOrderByInput',
});
let ChannelNftCollectorsArgs = class ChannelNftCollectorsArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], ChannelNftCollectorsArgs.prototype, "channelId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => ChannelNftCollectorsOrderByInput, { nullable: true }),
    __metadata("design:type", Number)
], ChannelNftCollectorsArgs.prototype, "orderBy", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ChannelNftCollectorsArgs.prototype, "limit", void 0);
ChannelNftCollectorsArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], ChannelNftCollectorsArgs);
exports.ChannelNftCollectorsArgs = ChannelNftCollectorsArgs;
let ReportChannelArgs = class ReportChannelArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], ReportChannelArgs.prototype, "channelId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    (0, class_validator_1.MaxLength)(400, { message: 'Rationale cannot be longer than 400 characters' }),
    __metadata("design:type", String)
], ReportChannelArgs.prototype, "rationale", void 0);
ReportChannelArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], ReportChannelArgs);
exports.ReportChannelArgs = ReportChannelArgs;
let FollowChannelArgs = class FollowChannelArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], FollowChannelArgs.prototype, "channelId", void 0);
FollowChannelArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], FollowChannelArgs);
exports.FollowChannelArgs = FollowChannelArgs;
let UnfollowChannelArgs = class UnfollowChannelArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], UnfollowChannelArgs.prototype, "channelId", void 0);
UnfollowChannelArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], UnfollowChannelArgs);
exports.UnfollowChannelArgs = UnfollowChannelArgs;
let ChannelFollowResult = class ChannelFollowResult {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], ChannelFollowResult.prototype, "followId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], ChannelFollowResult.prototype, "channelId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], ChannelFollowResult.prototype, "follows", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: false }),
    __metadata("design:type", Boolean)
], ChannelFollowResult.prototype, "added", void 0);
ChannelFollowResult = __decorate([
    (0, type_graphql_1.ObjectType)()
], ChannelFollowResult);
exports.ChannelFollowResult = ChannelFollowResult;
let ChannelUnfollowResult = class ChannelUnfollowResult {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], ChannelUnfollowResult.prototype, "channelId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], ChannelUnfollowResult.prototype, "follows", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: false }),
    __metadata("design:type", Boolean)
], ChannelUnfollowResult.prototype, "removed", void 0);
ChannelUnfollowResult = __decorate([
    (0, type_graphql_1.ObjectType)()
], ChannelUnfollowResult);
exports.ChannelUnfollowResult = ChannelUnfollowResult;
let ChannelReportInfo = class ChannelReportInfo extends commonTypes_1.EntityReportInfo {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], ChannelReportInfo.prototype, "channelId", void 0);
ChannelReportInfo = __decorate([
    (0, type_graphql_1.ObjectType)()
], ChannelReportInfo);
exports.ChannelReportInfo = ChannelReportInfo;
let ChannelsSearchResult = class ChannelsSearchResult {
};
__decorate([
    (0, type_graphql_1.Field)(() => baseTypes_1.Channel, { nullable: false }),
    __metadata("design:type", baseTypes_1.Channel)
], ChannelsSearchResult.prototype, "channel", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], ChannelsSearchResult.prototype, "relevance", void 0);
ChannelsSearchResult = __decorate([
    (0, type_graphql_1.ObjectType)()
], ChannelsSearchResult);
exports.ChannelsSearchResult = ChannelsSearchResult;
let ChannelsSearchArgs = class ChannelsSearchArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], ChannelsSearchArgs.prototype, "query", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => baseTypes_1.ChannelWhereInput, { nullable: true }),
    __metadata("design:type", Object)
], ChannelsSearchArgs.prototype, "where", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ChannelsSearchArgs.prototype, "limit", void 0);
ChannelsSearchArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], ChannelsSearchArgs);
exports.ChannelsSearchArgs = ChannelsSearchArgs;
//# sourceMappingURL=types.js.map