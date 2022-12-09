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
exports.StorageBag = void 0;
const typeorm_1 = require("typeorm");
const storageDataObject_model_1 = require("./storageDataObject.model");
const storageBucketBag_model_1 = require("./storageBucketBag.model");
const distributionBucketBag_model_1 = require("./distributionBucketBag.model");
const _storageBagOwner_1 = require("./_storageBagOwner");
let StorageBag = class StorageBag {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], StorageBag.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => storageDataObject_model_1.StorageDataObject, e => e.storageBag),
    __metadata("design:type", Array)
], StorageBag.prototype, "objects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => storageBucketBag_model_1.StorageBucketBag, e => e.bag),
    __metadata("design:type", Array)
], StorageBag.prototype, "storageBuckets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => distributionBucketBag_model_1.DistributionBucketBag, e => e.bag),
    __metadata("design:type", Array)
], StorageBag.prototype, "distributionBuckets", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { transformer: { to: obj => obj.toJSON(), from: obj => obj == null ? undefined : (0, _storageBagOwner_1.fromJsonStorageBagOwner)(obj) }, nullable: false }),
    __metadata("design:type", Object)
], StorageBag.prototype, "owner", void 0);
StorageBag = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], StorageBag);
exports.StorageBag = StorageBag;
//# sourceMappingURL=storageBag.model.js.map