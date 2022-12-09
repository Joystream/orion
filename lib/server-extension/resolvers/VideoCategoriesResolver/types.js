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
exports.ExtendedVideoCategory = void 0;
const type_graphql_1 = require("type-graphql");
const baseTypes_1 = require("../baseTypes");
let ExtendedVideoCategory = class ExtendedVideoCategory {
};
__decorate([
    (0, type_graphql_1.Field)(() => baseTypes_1.VideoCategory, { nullable: false }),
    __metadata("design:type", baseTypes_1.VideoCategory)
], ExtendedVideoCategory.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: false }),
    __metadata("design:type", Number)
], ExtendedVideoCategory.prototype, "activeVideosCount", void 0);
ExtendedVideoCategory = __decorate([
    (0, type_graphql_1.ObjectType)()
], ExtendedVideoCategory);
exports.ExtendedVideoCategory = ExtendedVideoCategory;
//# sourceMappingURL=types.js.map