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
exports.EntityReportInfo = void 0;
const type_graphql_1 = require("type-graphql");
const graphql_server_1 = require("@subsquid/graphql-server");
let EntityReportInfo = class EntityReportInfo {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], EntityReportInfo.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: false }),
    __metadata("design:type", String)
], EntityReportInfo.prototype, "rationale", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime, { nullable: false }),
    __metadata("design:type", Date)
], EntityReportInfo.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: false }),
    __metadata("design:type", Boolean)
], EntityReportInfo.prototype, "created", void 0);
EntityReportInfo = __decorate([
    (0, type_graphql_1.ObjectType)()
], EntityReportInfo);
exports.EntityReportInfo = EntityReportInfo;
//# sourceMappingURL=commonTypes.js.map