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
exports.NftHistoryEntry = void 0;
const typeorm_1 = require("typeorm");
const ownedNft_model_1 = require("./ownedNft.model");
const event_model_1 = require("./event.model");
let NftHistoryEntry = class NftHistoryEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], NftHistoryEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => ownedNft_model_1.OwnedNft, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", ownedNft_model_1.OwnedNft)
], NftHistoryEntry.prototype, "nft", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], NftHistoryEntry.prototype, "nftId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => event_model_1.Event, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", event_model_1.Event)
], NftHistoryEntry.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], NftHistoryEntry.prototype, "eventId", void 0);
NftHistoryEntry = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], NftHistoryEntry);
exports.NftHistoryEntry = NftHistoryEntry;
//# sourceMappingURL=nftHistoryEntry.model.js.map