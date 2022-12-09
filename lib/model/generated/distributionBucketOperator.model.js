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
exports.DistributionBucketOperator = void 0;
const typeorm_1 = require("typeorm");
const distributionBucket_model_1 = require("./distributionBucket.model");
const _distributionBucketOperatorStatus_1 = require("./_distributionBucketOperatorStatus");
let DistributionBucketOperator = class DistributionBucketOperator {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], DistributionBucketOperator.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => distributionBucket_model_1.DistributionBucket, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", distributionBucket_model_1.DistributionBucket)
], DistributionBucketOperator.prototype, "distributionBucket", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], DistributionBucketOperator.prototype, "distributionBucketId", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: false }),
    __metadata("design:type", Number)
], DistributionBucketOperator.prototype, "workerId", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 7, nullable: false }),
    __metadata("design:type", String)
], DistributionBucketOperator.prototype, "status", void 0);
DistributionBucketOperator = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], DistributionBucketOperator);
exports.DistributionBucketOperator = DistributionBucketOperator;
//# sourceMappingURL=distributionBucketOperator.model.js.map