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
exports.SetFeaturedNftsResult = exports.SetFeaturedNftsInput = exports.GeneratedSignature = exports.AppActionSignatureInput = exports.RestoreContentResult = exports.RestoreContentArgs = exports.ExcludeContentResult = exports.ExcludeContentArgs = exports.ExcludableContentType = exports.SetCategoryFeaturedVideosResult = exports.SetCategoryFeaturedVideosArgs = exports.SetSupportedCategoriesResult = exports.SetSupportedCategoriesInput = exports.SetVideoHeroResult = exports.SetVideoHeroInput = exports.VideoViewPerUserTimeLimit = exports.SetVideoViewPerUserTimeLimitInput = exports.KillSwitch = exports.SetKillSwitchInput = exports.VideoWeights = exports.SetVideoWeightsInput = void 0;
const type_graphql_1 = require("type-graphql");
const metadata_protobuf_1 = require("@joystream/metadata-protobuf");
let SetVideoWeightsInput = class SetVideoWeightsInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float, { nullable: false }),
    __metadata("design:type", Number)
], SetVideoWeightsInput.prototype, "newnessWeight", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float, { nullable: false }),
    __metadata("design:type", Number)
], SetVideoWeightsInput.prototype, "viewsWeight", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float, { nullable: false }),
    __metadata("design:type", Number)
], SetVideoWeightsInput.prototype, "commentsWeight", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float, { nullable: false }),
    __metadata("design:type", Number)
], SetVideoWeightsInput.prototype, "reactionsWeight", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float, { nullable: false }),
    __metadata("design:type", Number)
], SetVideoWeightsInput.prototype, "joysteamTimestampSubWeight", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float, { nullable: false }),
    __metadata("design:type", Number)
], SetVideoWeightsInput.prototype, "ytTimestampSubWeight", void 0);
SetVideoWeightsInput = __decorate([
    (0, type_graphql_1.ArgsType)()
], SetVideoWeightsInput);
exports.SetVideoWeightsInput = SetVideoWeightsInput;
let VideoWeights = class VideoWeights {
};
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: false }),
    __metadata("design:type", Boolean)
], VideoWeights.prototype, "isApplied", void 0);
VideoWeights = __decorate([
    (0, type_graphql_1.ObjectType)()
], VideoWeights);
exports.VideoWeights = VideoWeights;
let SetKillSwitchInput = class SetKillSwitchInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: false }),
    __metadata("design:type", Boolean)
], SetKillSwitchInput.prototype, "isKilled", void 0);
SetKillSwitchInput = __decorate([
    (0, type_graphql_1.ArgsType)()
], SetKillSwitchInput);
exports.SetKillSwitchInput = SetKillSwitchInput;
let KillSwitch = class KillSwitch {
};
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: false }),
    __metadata("design:type", Boolean)
], KillSwitch.prototype, "isKilled", void 0);
KillSwitch = __decorate([
    (0, type_graphql_1.ObjectType)()
], KillSwitch);
exports.KillSwitch = KillSwitch;
let SetVideoViewPerUserTimeLimitInput = class SetVideoViewPerUserTimeLimitInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], SetVideoViewPerUserTimeLimitInput.prototype, "limitInSeconds", void 0);
SetVideoViewPerUserTimeLimitInput = __decorate([
    (0, type_graphql_1.ArgsType)()
], SetVideoViewPerUserTimeLimitInput);
exports.SetVideoViewPerUserTimeLimitInput = SetVideoViewPerUserTimeLimitInput;
let VideoViewPerUserTimeLimit = class VideoViewPerUserTimeLimit {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], VideoViewPerUserTimeLimit.prototype, "limitInSeconds", void 0);
VideoViewPerUserTimeLimit = __decorate([
    (0, type_graphql_1.ObjectType)()
], VideoViewPerUserTimeLimit);
exports.VideoViewPerUserTimeLimit = VideoViewPerUserTimeLimit;
let SetVideoHeroInput = class SetVideoHeroInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], SetVideoHeroInput.prototype, "videoId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], SetVideoHeroInput.prototype, "heroTitle", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], SetVideoHeroInput.prototype, "videoCutUrl", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], SetVideoHeroInput.prototype, "heroPosterUrl", void 0);
SetVideoHeroInput = __decorate([
    (0, type_graphql_1.ArgsType)()
], SetVideoHeroInput);
exports.SetVideoHeroInput = SetVideoHeroInput;
let SetVideoHeroResult = class SetVideoHeroResult {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], SetVideoHeroResult.prototype, "id", void 0);
SetVideoHeroResult = __decorate([
    (0, type_graphql_1.ObjectType)()
], SetVideoHeroResult);
exports.SetVideoHeroResult = SetVideoHeroResult;
let SetSupportedCategoriesInput = class SetSupportedCategoriesInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => [String], {
        nullable: true,
        description: 'IDs of the video categories that should be supported by the Gateway',
    }),
    __metadata("design:type", Array)
], SetSupportedCategoriesInput.prototype, "supportedCategoriesIds", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, {
        nullable: true,
        description: 'Whether the newly created video categories should be supported by default',
    }),
    __metadata("design:type", Boolean)
], SetSupportedCategoriesInput.prototype, "supportNewCategories", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, {
        nullable: true,
        description: 'Whether the Gateway should support videos that have no category assigned',
    }),
    __metadata("design:type", Boolean)
], SetSupportedCategoriesInput.prototype, "supportNoCategoryVideos", void 0);
SetSupportedCategoriesInput = __decorate([
    (0, type_graphql_1.ArgsType)()
], SetSupportedCategoriesInput);
exports.SetSupportedCategoriesInput = SetSupportedCategoriesInput;
let SetSupportedCategoriesResult = class SetSupportedCategoriesResult {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, {
        nullable: true,
        description: 'The updated number of categories that are now explicitly supported by the Gateway',
    }),
    __metadata("design:type", Number)
], SetSupportedCategoriesResult.prototype, "newNumberOfCategoriesSupported", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, {
        nullable: false,
        description: 'Whether or not newly created video categories will be automatically supported',
    }),
    __metadata("design:type", Boolean)
], SetSupportedCategoriesResult.prototype, "newlyCreatedCategoriesSupported", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, {
        nullable: false,
        description: 'Whether or not vidoes w/o any category assigned will be supported',
    }),
    __metadata("design:type", Boolean)
], SetSupportedCategoriesResult.prototype, "noCategoryVideosSupported", void 0);
SetSupportedCategoriesResult = __decorate([
    (0, type_graphql_1.ObjectType)()
], SetSupportedCategoriesResult);
exports.SetSupportedCategoriesResult = SetSupportedCategoriesResult;
let FeaturedVideoInput = class FeaturedVideoInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], FeaturedVideoInput.prototype, "videoId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], FeaturedVideoInput.prototype, "videoCutUrl", void 0);
FeaturedVideoInput = __decorate([
    (0, type_graphql_1.InputType)()
], FeaturedVideoInput);
let SetCategoryFeaturedVideosArgs = class SetCategoryFeaturedVideosArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], SetCategoryFeaturedVideosArgs.prototype, "categoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [FeaturedVideoInput]),
    __metadata("design:type", Array)
], SetCategoryFeaturedVideosArgs.prototype, "videos", void 0);
SetCategoryFeaturedVideosArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], SetCategoryFeaturedVideosArgs);
exports.SetCategoryFeaturedVideosArgs = SetCategoryFeaturedVideosArgs;
let SetCategoryFeaturedVideosResult = class SetCategoryFeaturedVideosResult {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], SetCategoryFeaturedVideosResult.prototype, "categoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], SetCategoryFeaturedVideosResult.prototype, "numberOfFeaturedVideosUnset", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], SetCategoryFeaturedVideosResult.prototype, "numberOfFeaturedVideosSet", void 0);
SetCategoryFeaturedVideosResult = __decorate([
    (0, type_graphql_1.ObjectType)()
], SetCategoryFeaturedVideosResult);
exports.SetCategoryFeaturedVideosResult = SetCategoryFeaturedVideosResult;
var ExcludableContentType;
(function (ExcludableContentType) {
    ExcludableContentType["Channel"] = "channel";
    ExcludableContentType["Video"] = "video";
    ExcludableContentType["Comment"] = "comment";
})(ExcludableContentType = exports.ExcludableContentType || (exports.ExcludableContentType = {}));
(0, type_graphql_1.registerEnumType)(ExcludableContentType, { name: 'ExcludableContentType' });
let ExcludeContentArgs = class ExcludeContentArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => ExcludableContentType, {
        nullable: false,
        description: 'Type of the content to exclude/hide',
    }),
    __metadata("design:type", String)
], ExcludeContentArgs.prototype, "type", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], {
        nullable: false,
        description: 'IDs of the entities to be excluded (hidden)',
    }),
    __metadata("design:type", Array)
], ExcludeContentArgs.prototype, "ids", void 0);
ExcludeContentArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], ExcludeContentArgs);
exports.ExcludeContentArgs = ExcludeContentArgs;
let ExcludeContentResult = class ExcludeContentResult {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ExcludeContentResult.prototype, "numberOfEntitiesAffected", void 0);
ExcludeContentResult = __decorate([
    (0, type_graphql_1.ObjectType)()
], ExcludeContentResult);
exports.ExcludeContentResult = ExcludeContentResult;
let RestoreContentArgs = class RestoreContentArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => ExcludableContentType, {
        nullable: false,
        description: 'Type of the content to restore',
    }),
    __metadata("design:type", String)
], RestoreContentArgs.prototype, "type", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], {
        nullable: false,
        description: 'IDs of the entities to be restored',
    }),
    __metadata("design:type", Array)
], RestoreContentArgs.prototype, "ids", void 0);
RestoreContentArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], RestoreContentArgs);
exports.RestoreContentArgs = RestoreContentArgs;
let RestoreContentResult = class RestoreContentResult {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], RestoreContentResult.prototype, "numberOfEntitiesAffected", void 0);
RestoreContentResult = __decorate([
    (0, type_graphql_1.ObjectType)()
], RestoreContentResult);
exports.RestoreContentResult = RestoreContentResult;
let AppActionSignatureInput = class AppActionSignatureInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], AppActionSignatureInput.prototype, "nonce", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AppActionSignatureInput.prototype, "creatorId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ description: 'Hex string from UInt8Array' }),
    __metadata("design:type", String)
], AppActionSignatureInput.prototype, "assets", void 0);
__decorate([
    (0, type_graphql_1.Field)({ description: 'Hex string from UInt8Array' }),
    __metadata("design:type", String)
], AppActionSignatureInput.prototype, "rawAction", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => metadata_protobuf_1.AppAction.ActionType),
    __metadata("design:type", Number)
], AppActionSignatureInput.prototype, "actionType", void 0);
AppActionSignatureInput = __decorate([
    (0, type_graphql_1.ArgsType)()
], AppActionSignatureInput);
exports.AppActionSignatureInput = AppActionSignatureInput;
let GeneratedSignature = class GeneratedSignature {
};
__decorate([
    (0, type_graphql_1.Field)({ description: 'App signature converted to hexadecimal string.' }),
    __metadata("design:type", String)
], GeneratedSignature.prototype, "signature", void 0);
GeneratedSignature = __decorate([
    (0, type_graphql_1.ObjectType)()
], GeneratedSignature);
exports.GeneratedSignature = GeneratedSignature;
(0, type_graphql_1.registerEnumType)(metadata_protobuf_1.AppAction.ActionType, { name: 'AppActionActionType' });
let SetFeaturedNftsInput = class SetFeaturedNftsInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => [String], {
        description: 'IDs of the NFTs that should be featured by the Gateway',
    }),
    __metadata("design:type", Array)
], SetFeaturedNftsInput.prototype, "featuredNftsIds", void 0);
SetFeaturedNftsInput = __decorate([
    (0, type_graphql_1.ArgsType)()
], SetFeaturedNftsInput);
exports.SetFeaturedNftsInput = SetFeaturedNftsInput;
let SetFeaturedNftsResult = class SetFeaturedNftsResult {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, {
        nullable: true,
        description: 'The updated number of nft that are now explicitly featured by the Gateway',
    }),
    __metadata("design:type", Number)
], SetFeaturedNftsResult.prototype, "newNumberOfNftsFeatured", void 0);
SetFeaturedNftsResult = __decorate([
    (0, type_graphql_1.ObjectType)()
], SetFeaturedNftsResult);
exports.SetFeaturedNftsResult = SetFeaturedNftsResult;
//# sourceMappingURL=types.js.map