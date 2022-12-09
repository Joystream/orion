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
exports.CommentReaction = void 0;
const typeorm_1 = require("typeorm");
const membership_model_1 = require("./membership.model");
const comment_model_1 = require("./comment.model");
const video_model_1 = require("./video.model");
let CommentReaction = class CommentReaction {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], CommentReaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: false }),
    __metadata("design:type", Number)
], CommentReaction.prototype, "reactionId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => membership_model_1.Membership, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", membership_model_1.Membership)
], CommentReaction.prototype, "member", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], CommentReaction.prototype, "memberId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => comment_model_1.Comment, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", comment_model_1.Comment)
], CommentReaction.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], CommentReaction.prototype, "commentId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => video_model_1.Video, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", video_model_1.Video)
], CommentReaction.prototype, "video", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], CommentReaction.prototype, "videoId", void 0);
CommentReaction = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], CommentReaction);
exports.CommentReaction = CommentReaction;
//# sourceMappingURL=commentReaction.model.js.map