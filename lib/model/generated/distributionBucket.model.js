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
exports.DistributionBucket = void 0;
const typeorm_1 = require("typeorm");
const distributionBucketFamily_model_1 = require("./distributionBucketFamily.model");
const distributionBucketOperator_model_1 = require("./distributionBucketOperator.model");
const distributionBucketBag_model_1 = require("./distributionBucketBag.model");
let DistributionBucket = class DistributionBucket {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], DistributionBucket.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => distributionBucketFamily_model_1.DistributionBucketFamily, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", distributionBucketFamily_model_1.DistributionBucketFamily)
], DistributionBucket.prototype, "family", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], DistributionBucket.prototype, "familyId", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: false }),
    __metadata("design:type", Number)
], DistributionBucket.prototype, "bucketIndex", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => distributionBucketOperator_model_1.DistributionBucketOperator, e => e.distributionBucket),
    __metadata("design:type", Array)
], DistributionBucket.prototype, "operators", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: false }),
    __metadata("design:type", Boolean)
], DistributionBucket.prototype, "acceptingNewBags", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: false }),
    __metadata("design:type", Boolean)
], DistributionBucket.prototype, "distributing", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => distributionBucketBag_model_1.DistributionBucketBag, e => e.distributionBucket),
    __metadata("design:type", Array)
], DistributionBucket.prototype, "bags", void 0);
DistributionBucket = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], DistributionBucket);
exports.DistributionBucket = DistributionBucket;
//# sourceMappingURL=distributionBucket.model.js.map