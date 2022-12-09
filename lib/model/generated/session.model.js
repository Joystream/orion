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
exports.Session = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("./user.model");
const account_model_1 = require("./account.model");
let Session = class Session {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Session.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], Session.prototype, "browser", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], Session.prototype, "os", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], Session.prototype, "device", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], Session.prototype, "deviceType", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => user_model_1.User, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", user_model_1.User)
], Session.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Session.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => account_model_1.Account, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", Object)
], Session.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Session.prototype, "accountId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], Session.prototype, "ip", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { nullable: false }),
    __metadata("design:type", Date
    /**
     * Time when the session expires or did expire
     */
    )
], Session.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { nullable: false }),
    __metadata("design:type", Date)
], Session.prototype, "expiry", void 0);
Session = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Session);
exports.Session = Session;
//# sourceMappingURL=session.model.js.map