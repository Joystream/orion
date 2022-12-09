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
var VideoCategory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCategory = void 0;
const typeorm_1 = require("typeorm");
const video_model_1 = require("./video.model");
const videoFeaturedInCategory_model_1 = require("./videoFeaturedInCategory.model");
let VideoCategory = VideoCategory_1 = class VideoCategory {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], VideoCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], VideoCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], VideoCategory.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => VideoCategory_1, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", Object)
], VideoCategory.prototype, "parentCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], VideoCategory.prototype, "parentCategoryId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => video_model_1.Video, e => e.category),
    __metadata("design:type", Array)
], VideoCategory.prototype, "videos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => videoFeaturedInCategory_model_1.VideoFeaturedInCategory, e => e.category),
    __metadata("design:type", Array)
], VideoCategory.prototype, "featuredVideos", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: false }),
    __metadata("design:type", Boolean)
], VideoCategory.prototype, "isSupported", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: false }),
    __metadata("design:type", Number)
], VideoCategory.prototype, "createdInBlock", void 0);
VideoCategory = VideoCategory_1 = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], VideoCategory);
exports.VideoCategory = VideoCategory;
//# sourceMappingURL=videoCategory.model.js.map