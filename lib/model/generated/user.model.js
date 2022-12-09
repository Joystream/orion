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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const channelFollow_model_1 = require("./channelFollow.model");
const videoViewEvent_model_1 = require("./videoViewEvent.model");
const report_model_1 = require("./report.model");
const nftFeaturingRequest_model_1 = require("./nftFeaturingRequest.model");
let User = class User {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isRoot", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => channelFollow_model_1.ChannelFollow, e => e.user),
    __metadata("design:type", Array)
], User.prototype, "channelFollows", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => videoViewEvent_model_1.VideoViewEvent, e => e.user),
    __metadata("design:type", Array)
], User.prototype, "videoViewEvents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => report_model_1.Report, e => e.user),
    __metadata("design:type", Array)
], User.prototype, "reports", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => nftFeaturingRequest_model_1.NftFeaturingRequest, e => e.user),
    __metadata("design:type", Array)
], User.prototype, "nftFeaturingRequests", void 0);
User = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], User);
exports.User = User;
//# sourceMappingURL=user.model.js.map