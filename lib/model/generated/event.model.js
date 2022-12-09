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
exports.Event = void 0;
const typeorm_1 = require("typeorm");
const _eventData_1 = require("./_eventData");
let Event = class Event {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Event.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: false }),
    __metadata("design:type", Number)
], Event.prototype, "inBlock", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "inExtrinsic", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: false }),
    __metadata("design:type", Number)
], Event.prototype, "indexInBlock", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { nullable: false }),
    __metadata("design:type", Date
    /**
     * More specific event data, which depends on event type
     */
    )
], Event.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { transformer: { to: obj => obj.toJSON(), from: obj => obj == null ? undefined : (0, _eventData_1.fromJsonEventData)(obj) }, nullable: false }),
    __metadata("design:type", Object)
], Event.prototype, "data", void 0);
Event = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Event);
exports.Event = Event;
//# sourceMappingURL=event.model.js.map