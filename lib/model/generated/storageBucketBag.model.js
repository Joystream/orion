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
exports.StorageBucketBag = void 0;
const typeorm_1 = require("typeorm");
const storageBucket_model_1 = require("./storageBucket.model");
const storageBag_model_1 = require("./storageBag.model");
let StorageBucketBag = class StorageBucketBag {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], StorageBucketBag.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => storageBucket_model_1.StorageBucket, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", storageBucket_model_1.StorageBucket)
], StorageBucketBag.prototype, "storageBucket", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], StorageBucketBag.prototype, "storageBucketId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => storageBag_model_1.StorageBag, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", storageBag_model_1.StorageBag)
], StorageBucketBag.prototype, "bag", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], StorageBucketBag.prototype, "bagId", void 0);
StorageBucketBag = __decorate([
    (0, typeorm_1.Unique)('StorageBucketBag_storageBucket_bag', ["storageBucket", "bag"], { deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.Index)(["storageBucket", "bag"]),
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], StorageBucketBag);
exports.StorageBucketBag = StorageBucketBag;
//# sourceMappingURL=storageBucketBag.model.js.map