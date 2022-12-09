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
exports.VideoReaction = void 0;
const typeorm_1 = require("typeorm");
const _videoReactionOptions_1 = require("./_videoReactionOptions");
const membership_model_1 = require("./membership.model");
const video_model_1 = require("./video.model");
let VideoReaction = class VideoReaction {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], VideoReaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { nullable: false }),
    __metadata("design:type", Date
    /**
     * The Reaction
     */
    )
], VideoReaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 6, nullable: false }),
    __metadata("design:type", String)
], VideoReaction.prototype, "reaction", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => membership_model_1.Membership, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", membership_model_1.Membership)
], VideoReaction.prototype, "member", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], VideoReaction.prototype, "memberId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => video_model_1.Video, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", video_model_1.Video)
], VideoReaction.prototype, "video", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], VideoReaction.prototype, "videoId", void 0);
VideoReaction = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], VideoReaction);
exports.VideoReaction = VideoReaction;
//# sourceMappingURL=videoReaction.model.js.map