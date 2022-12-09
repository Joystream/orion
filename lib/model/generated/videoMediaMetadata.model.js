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
exports.VideoMediaMetadata = void 0;
const typeorm_1 = require("typeorm");
const marshal = __importStar(require("./marshal"));
const videoMediaEncoding_model_1 = require("./videoMediaEncoding.model");
const video_model_1 = require("./video.model");
let VideoMediaMetadata = class VideoMediaMetadata {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], VideoMediaMetadata.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => videoMediaEncoding_model_1.VideoMediaEncoding, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", Object)
], VideoMediaMetadata.prototype, "encoding", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], VideoMediaMetadata.prototype, "encodingId", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: true }),
    __metadata("design:type", Object)
], VideoMediaMetadata.prototype, "pixelWidth", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: true }),
    __metadata("design:type", Object)
], VideoMediaMetadata.prototype, "pixelHeight", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { transformer: marshal.bigintTransformer, nullable: true }),
    __metadata("design:type", Object)
], VideoMediaMetadata.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.OneToOne)(() => video_model_1.Video, { nullable: false, deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", video_model_1.Video)
], VideoMediaMetadata.prototype, "video", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VideoMediaMetadata.prototype, "videoId", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: false }),
    __metadata("design:type", Number)
], VideoMediaMetadata.prototype, "createdInBlock", void 0);
VideoMediaMetadata = __decorate([
    (0, typeorm_1.Unique)('VideoMediaMetadata_video', ["video"], { deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], VideoMediaMetadata);
exports.VideoMediaMetadata = VideoMediaMetadata;
//# sourceMappingURL=videoMediaMetadata.model.js.map