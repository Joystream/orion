"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnedNft = void 0;
const typeorm_1 = require("typeorm");
const marshal = __importStar(require("./marshal"));
const video_model_1 = require("./video.model");
const auction_model_1 = require("./auction.model");
const _nftOwner_1 = require("./_nftOwner");
const _transactionalStatus_1 = require("./_transactionalStatus");
const bid_model_1 = require("./bid.model");
/**
 * Represents NFT details
 */
let OwnedNft = class OwnedNft {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], OwnedNft.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { nullable: false }),
    __metadata("design:type", Date
    /**
     * NFT's video
     */
    )
], OwnedNft.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.OneToOne)(() => video_model_1.Video, { nullable: false, deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", video_model_1.Video)
], OwnedNft.prototype, "video", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OwnedNft.prototype, "videoId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => auction_model_1.Auction, e => e.nft),
    __metadata("design:type", Array)
], OwnedNft.prototype, "auctions", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { transformer: { to: obj => obj.toJSON(), from: obj => obj == null ? undefined : (0, _nftOwner_1.fromJsonNftOwner)(obj) }, nullable: false }),
    __metadata("design:type", Object)
], OwnedNft.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { transformer: { to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : (0, _transactionalStatus_1.fromJsonTransactionalStatus)(obj) }, nullable: true }),
    __metadata("design:type", Object)
], OwnedNft.prototype, "transactionalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { transformer: marshal.floatTransformer, nullable: true }),
    __metadata("design:type", Object)
], OwnedNft.prototype, "creatorRoyalty", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { transformer: marshal.bigintTransformer, nullable: true }),
    __metadata("design:type", Object)
], OwnedNft.prototype, "lastSalePrice", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { nullable: true }),
    __metadata("design:type", Object)
], OwnedNft.prototype, "lastSaleDate", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bid_model_1.Bid, e => e.nft),
    __metadata("design:type", Array)
], OwnedNft.prototype, "bids", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: false }),
    __metadata("design:type", Boolean)
], OwnedNft.prototype, "isFeatured", void 0);
OwnedNft = __decorate([
    (0, typeorm_1.Unique)('OwnedNft_video', ["video"], { deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], OwnedNft);
exports.OwnedNft = OwnedNft;
//# sourceMappingURL=ownedNft.model.js.map