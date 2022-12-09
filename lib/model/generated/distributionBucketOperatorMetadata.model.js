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
exports.DistributionBucketOperatorMetadata = void 0;
const typeorm_1 = require("typeorm");
const distributionBucketOperator_model_1 = require("./distributionBucketOperator.model");
const _nodeLocationMetadata_1 = require("./_nodeLocationMetadata");
let DistributionBucketOperatorMetadata = class DistributionBucketOperatorMetadata {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], DistributionBucketOperatorMetadata.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.OneToOne)(() => distributionBucketOperator_model_1.DistributionBucketOperator, { nullable: false, deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", distributionBucketOperator_model_1.DistributionBucketOperator)
], DistributionBucketOperatorMetadata.prototype, "distirbutionBucketOperator", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DistributionBucketOperatorMetadata.prototype, "distirbutionBucketOperatorId", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], DistributionBucketOperatorMetadata.prototype, "nodeEndpoint", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { transformer: { to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new _nodeLocationMetadata_1.NodeLocationMetadata(undefined, obj) }, nullable: true }),
    __metadata("design:type", Object)
], DistributionBucketOperatorMetadata.prototype, "nodeLocation", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], DistributionBucketOperatorMetadata.prototype, "extra", void 0);
DistributionBucketOperatorMetadata = __decorate([
    (0, typeorm_1.Unique)('DistributionBucketOperatorMetadata_distirbutionBucketOperator', ["distirbutionBucketOperator"], { deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], DistributionBucketOperatorMetadata);
exports.DistributionBucketOperatorMetadata = DistributionBucketOperatorMetadata;
//# sourceMappingURL=distributionBucketOperatorMetadata.model.js.map