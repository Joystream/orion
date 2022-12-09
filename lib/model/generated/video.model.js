"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const typeorm_1 = require("typeorm");
const marshal = __importStar(require("./marshal"));
const channel_model_1 = require("./channel.model");
const videoCategory_model_1 = require("./videoCategory.model");
const storageDataObject_model_1 = require("./storageDataObject.model");
const license_model_1 = require("./license.model");
const videoSubtitle_model_1 = require("./videoSubtitle.model");
const comment_model_1 = require("./comment.model");
const videoReaction_model_1 = require("./videoReaction.model");
const _videoReactionsCountByReactionType_1 = require("./_videoReactionsCountByReactionType");
const app_model_1 = require("./app.model");
let Video = class Video {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Video.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { nullable: false }),
    __metadata("design:type", Date
    /**
     * Reference to videos's channel
     */
    )
], Video.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => channel_model_1.Channel, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", channel_model_1.Channel)
], Video.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "channelId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => videoCategory_model_1.VideoCategory, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", Object)
], Video.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => storageDataObject_model_1.StorageDataObject, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", Object)
], Video.prototype, "thumbnailPhoto", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "thumbnailPhotoId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "hasMarketing", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "publishedBeforeJoystream", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: false }),
    __metadata("design:type", Boolean)
], Video.prototype, "isCensored", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: false }),
    __metadata("design:type", Boolean)
], Video.prototype, "isExcluded", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "isExplicit", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => license_model_1.License, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", Object)
], Video.prototype, "license", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "licenseId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => storageDataObject_model_1.StorageDataObject, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", Object)
], Video.prototype, "media", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "mediaId", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { transformer: marshal.bigintTransformer, nullable: false }),
    __metadata("design:type", BigInt)
], Video.prototype, "videoStateBloatBond", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: false }),
    __metadata("design:type", Number)
], Video.prototype, "createdInBlock", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => videoSubtitle_model_1.VideoSubtitle, e => e.video),
    __metadata("design:type", Array)
], Video.prototype, "subtitles", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: false }),
    __metadata("design:type", Boolean)
], Video.prototype, "isCommentSectionEnabled", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => comment_model_1.Comment, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", Object)
], Video.prototype, "pinnedComment", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "pinnedCommentId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_model_1.Comment, e => e.video),
    __metadata("design:type", Array)
], Video.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: false }),
    __metadata("design:type", Number)
], Video.prototype, "commentsCount", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: false }),
    __metadata("design:type", Boolean)
], Video.prototype, "isReactionFeatureEnabled", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => videoReaction_model_1.VideoReaction, e => e.video),
    __metadata("design:type", Array)
], Video.prototype, "reactions", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { transformer: { to: obj => obj == null ? undefined : obj.map((val) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new _videoReactionsCountByReactionType_1.VideoReactionsCountByReactionType(undefined, marshal.nonNull(val))) }, nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "reactionsCountByReactionId", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: false }),
    __metadata("design:type", Number)
], Video.prototype, "reactionsCount", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: false }),
    __metadata("design:type", Number)
], Video.prototype, "viewsNum", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => app_model_1.App, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", Object)
], Video.prototype, "entryApp", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "entryAppId", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "ytVideoId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("numeric", { transformer: marshal.floatTransformer, nullable: false }),
    __metadata("design:type", Number)
], Video.prototype, "videoRelevance", void 0);
Video = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Video);
exports.Video = Video;
//# sourceMappingURL=video.model.js.map