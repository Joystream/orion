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
exports.NftFeaturedRequstInfo = exports.RequestFeaturedNftArgs = exports.EndingAuctionsNftsArgs = void 0;
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
const graphql_server_1 = require("@subsquid/graphql-server");
const baseTypes_1 = require("../baseTypes");
let EndingAuctionsNftsArgs = class EndingAuctionsNftsArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => baseTypes_1.OwnedNftWhereInput, { nullable: true }),
    __metadata("design:type", Object)
], EndingAuctionsNftsArgs.prototype, "where", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], EndingAuctionsNftsArgs.prototype, "limit", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], EndingAuctionsNftsArgs.prototype, "offset", void 0);
EndingAuctionsNftsArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], EndingAuctionsNftsArgs);
exports.EndingAuctionsNftsArgs = EndingAuctionsNftsArgs;
let RequestFeaturedNftArgs = class RequestFeaturedNftArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], RequestFeaturedNftArgs.prototype, "nftId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    (0, class_validator_1.MaxLength)(400, { message: 'Rationale cannot be longer than 400 characters' }),
    __metadata("design:type", String)
], RequestFeaturedNftArgs.prototype, "rationale", void 0);
RequestFeaturedNftArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], RequestFeaturedNftArgs);
exports.RequestFeaturedNftArgs = RequestFeaturedNftArgs;
let NftFeaturedRequstInfo = class NftFeaturedRequstInfo {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], NftFeaturedRequstInfo.prototype, "nftId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], NftFeaturedRequstInfo.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], NftFeaturedRequstInfo.prototype, "rationale", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime, { nullable: false }),
    __metadata("design:type", Date)
], NftFeaturedRequstInfo.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: false }),
    __metadata("design:type", Boolean)
], NftFeaturedRequstInfo.prototype, "created", void 0);
NftFeaturedRequstInfo = __decorate([
    (0, type_graphql_1.ObjectType)()
], NftFeaturedRequstInfo);
exports.NftFeaturedRequstInfo = NftFeaturedRequstInfo;
//# sourceMappingURL=types.js.map