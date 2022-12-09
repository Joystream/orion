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
exports.DistributionBucketBag = void 0;
const typeorm_1 = require("typeorm");
const distributionBucket_model_1 = require("./distributionBucket.model");
const storageBag_model_1 = require("./storageBag.model");
let DistributionBucketBag = class DistributionBucketBag {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], DistributionBucketBag.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => distributionBucket_model_1.DistributionBucket, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", distributionBucket_model_1.DistributionBucket)
], DistributionBucketBag.prototype, "distributionBucket", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], DistributionBucketBag.prototype, "distributionBucketId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => storageBag_model_1.StorageBag, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", storageBag_model_1.StorageBag)
], DistributionBucketBag.prototype, "bag", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], DistributionBucketBag.prototype, "bagId", void 0);
DistributionBucketBag = __decorate([
    (0, typeorm_1.Unique)('DistributionBucketBag_distributionBucket_bag', ["distributionBucket", "bag"], { deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.Index)(["distributionBucket", "bag"]),
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], DistributionBucketBag);
exports.DistributionBucketBag = DistributionBucketBag;
//# sourceMappingURL=distributionBucketBag.model.js.map