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
var Bid_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bid = void 0;
const typeorm_1 = require("typeorm");
const marshal = __importStar(require("./marshal"));
const auction_model_1 = require("./auction.model");
const ownedNft_model_1 = require("./ownedNft.model");
const membership_model_1 = require("./membership.model");
/**
 * Represents bid in NFT auction
 */
let Bid = Bid_1 = class Bid {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Bid.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { nullable: false }),
    __metadata("design:type", Date
    /**
     * NFT's auction
     */
    )
], Bid.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => auction_model_1.Auction, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", auction_model_1.Auction)
], Bid.prototype, "auction", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Bid.prototype, "auctionId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => ownedNft_model_1.OwnedNft, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", ownedNft_model_1.OwnedNft)
], Bid.prototype, "nft", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Bid.prototype, "nftId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => membership_model_1.Membership, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", membership_model_1.Membership)
], Bid.prototype, "bidder", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Bid.prototype, "bidderId", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { transformer: marshal.bigintTransformer, nullable: false }),
    __metadata("design:type", BigInt)
], Bid.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: false }),
    __metadata("design:type", Boolean)
], Bid.prototype, "isCanceled", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: false }),
    __metadata("design:type", Number)
], Bid.prototype, "createdInBlock", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: false }),
    __metadata("design:type", Number)
], Bid.prototype, "indexInBlock", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => Bid_1, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", Object)
], Bid.prototype, "previousTopBid", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Bid.prototype, "previousTopBidId", void 0);
Bid = Bid_1 = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Bid);
exports.Bid = Bid;
//# sourceMappingURL=bid.model.js.map