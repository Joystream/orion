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
exports.VideoSubtitle = void 0;
const typeorm_1 = require("typeorm");
const video_model_1 = require("./video.model");
const storageDataObject_model_1 = require("./storageDataObject.model");
let VideoSubtitle = class VideoSubtitle {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], VideoSubtitle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => video_model_1.Video, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", video_model_1.Video)
], VideoSubtitle.prototype, "video", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], VideoSubtitle.prototype, "videoId", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], VideoSubtitle.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], VideoSubtitle.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], VideoSubtitle.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => storageDataObject_model_1.StorageDataObject, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", Object)
], VideoSubtitle.prototype, "asset", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], VideoSubtitle.prototype, "assetId", void 0);
VideoSubtitle = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], VideoSubtitle);
exports.VideoSubtitle = VideoSubtitle;
//# sourceMappingURL=videoSubtitle.model.js.map