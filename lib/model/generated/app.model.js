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
exports.App = void 0;
const typeorm_1 = require("typeorm");
const membership_model_1 = require("./membership.model");
const video_model_1 = require("./video.model");
const channel_model_1 = require("./channel.model");
let App = class App {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], App.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], App.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => membership_model_1.Membership, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", membership_model_1.Membership)
], App.prototype, "ownerMember", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], App.prototype, "ownerMemberId", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], App.prototype, "websiteUrl", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], App.prototype, "useUri", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], App.prototype, "smallIcon", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], App.prototype, "mediumIcon", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], App.prototype, "bigIcon", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], App.prototype, "oneLiner", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], App.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], App.prototype, "termsOfService", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true, nullable: true }),
    __metadata("design:type", Object)
], App.prototype, "platforms", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], App.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], App.prototype, "authKey", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => video_model_1.Video, e => e.entryApp),
    __metadata("design:type", Array)
], App.prototype, "appVideos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => channel_model_1.Channel, e => e.entryApp),
    __metadata("design:type", Array)
], App.prototype, "appChannels", void 0);
App = __decorate([
    (0, typeorm_1.Unique)('App_name', ["name"], { deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], App);
exports.App = App;
//# sourceMappingURL=app.model.js.map