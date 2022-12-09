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
exports.ReportVideoArgs = exports.AddVideoViewResult = exports.VideoReportInfo = exports.MostViewedVideosConnectionArgs = exports.VideosConnectionArgs = exports.VideosSearchArgs = exports.VideosSearchResult = void 0;
const type_graphql_1 = require("type-graphql");
const baseTypes_1 = require("../baseTypes");
const commonTypes_1 = require("../commonTypes");
const class_validator_1 = require("class-validator");
let VideosSearchResult = class VideosSearchResult {
};
__decorate([
    (0, type_graphql_1.Field)(() => baseTypes_1.Video, { nullable: false }),
    __metadata("design:type", baseTypes_1.Video)
], VideosSearchResult.prototype, "video", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], VideosSearchResult.prototype, "relevance", void 0);
VideosSearchResult = __decorate([
    (0, type_graphql_1.ObjectType)()
], VideosSearchResult);
exports.VideosSearchResult = VideosSearchResult;
let VideosSearchArgs = class VideosSearchArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], VideosSearchArgs.prototype, "query", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => baseTypes_1.VideoWhereInput, { nullable: true }),
    __metadata("design:type", Object)
], VideosSearchArgs.prototype, "where", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], VideosSearchArgs.prototype, "limit", void 0);
VideosSearchArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], VideosSearchArgs);
exports.VideosSearchArgs = VideosSearchArgs;
let VideosConnectionArgs = class VideosConnectionArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], VideosConnectionArgs.prototype, "after", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], VideosConnectionArgs.prototype, "first", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [baseTypes_1.VideoOrderByInput], { nullable: false }),
    __metadata("design:type", Array)
], VideosConnectionArgs.prototype, "orderBy", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => baseTypes_1.VideoWhereInput, { nullable: true, simple: true }),
    __metadata("design:type", Object)
], VideosConnectionArgs.prototype, "where", void 0);
VideosConnectionArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], VideosConnectionArgs);
exports.VideosConnectionArgs = VideosConnectionArgs;
let MostViewedVideosConnectionArgs = class MostViewedVideosConnectionArgs extends VideosConnectionArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], MostViewedVideosConnectionArgs.prototype, "periodDays", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], MostViewedVideosConnectionArgs.prototype, "limit", void 0);
MostViewedVideosConnectionArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], MostViewedVideosConnectionArgs);
exports.MostViewedVideosConnectionArgs = MostViewedVideosConnectionArgs;
let VideoReportInfo = class VideoReportInfo extends commonTypes_1.EntityReportInfo {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], VideoReportInfo.prototype, "videoId", void 0);
VideoReportInfo = __decorate([
    (0, type_graphql_1.ObjectType)()
], VideoReportInfo);
exports.VideoReportInfo = VideoReportInfo;
let AddVideoViewResult = class AddVideoViewResult {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], AddVideoViewResult.prototype, "videoId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], AddVideoViewResult.prototype, "viewId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], AddVideoViewResult.prototype, "viewsNum", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: false }),
    __metadata("design:type", Boolean)
], AddVideoViewResult.prototype, "added", void 0);
AddVideoViewResult = __decorate([
    (0, type_graphql_1.ObjectType)()
], AddVideoViewResult);
exports.AddVideoViewResult = AddVideoViewResult;
let ReportVideoArgs = class ReportVideoArgs {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], ReportVideoArgs.prototype, "videoId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    (0, class_validator_1.MaxLength)(400, { message: 'Rationale cannot be longer than 400 characters' }),
    __metadata("design:type", String)
], ReportVideoArgs.prototype, "rationale", void 0);
ReportVideoArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], ReportVideoArgs);
exports.ReportVideoArgs = ReportVideoArgs;
//# sourceMappingURL=types.js.map