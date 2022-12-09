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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftResolver = void 0;
const type_graphql_1 = require("type-graphql");
const types_1 = require("./types");
const sql_1 = require("../../../utils/sql");
const model_1 = require("../../../model");
const baseTypes_1 = require("../baseTypes");
const model_2 = require("../model");
const tree_1 = require("@subsquid/openreader/lib/opencrud/tree");
const resolve_tree_1 = require("@subsquid/openreader/lib/util/resolve-tree");
const query_1 = require("@subsquid/openreader/lib/sql/query");
const lodash_1 = require("lodash");
const misc_1 = require("../../../utils/misc");
const crypto_1 = require("../../../utils/crypto");
let NftResolver = class NftResolver {
    constructor(em) {
        this.em = em;
    }
    async endingAuctionsNfts(args, info, ctx) {
        const em = await this.em();
        const dbResult = await em.query('SELECT "height" FROM "squid_processor"."status"');
        const lastProcessedBlock = Array.isArray(dbResult) &&
            (0, lodash_1.isObject)(dbResult[0]) &&
            (0, misc_1.has)(dbResult[0], 'height') &&
            typeof dbResult[0].height === 'number'
            ? dbResult[0].height
            : -1;
        const tree = (0, resolve_tree_1.getResolveTree)(info);
        const sqlArgs = (0, tree_1.parseSqlArguments)(model_2.model, 'OwnedNft', {
            ...args,
        });
        // Extract subsquid-supported OwnedNft fields
        const ownedNftFields = (0, tree_1.parseAnyTree)(model_2.model, 'OwnedNft', info.schema, tree);
        // Generate query using subsquid's ListQuery
        const listQuery = new query_1.ListQuery(model_2.model, ctx.openreader.dialect, 'OwnedNft', ownedNftFields, sqlArgs);
        let listQuerySql = listQuery.sql;
        listQuerySql = (0, sql_1.extendClause)(listQuerySql, 'FROM', `
        INNER JOIN (
          SELECT nft_id, auction_type->>'plannedEndAtBlock' AS end_block FROM auction a
          WHERE auction_type->>'isTypeOf' = 'AuctionTypeEnglish'
          AND (auction_type->>'plannedEndAtBlock')::int > ${lastProcessedBlock}
          AND a.is_canceled = false
          AND a.is_completed = false
        ) AS auctions ON auctions.nft_id = owned_nft.id 
`, '');
        listQuerySql = (0, sql_1.extendClause)(listQuerySql, 'ORDER BY', 'end_block::int asc', '');
        listQuery.sql = listQuerySql;
        const result = await ctx.openreader.executeQuery(listQuery);
        return result;
    }
    async requestNftFeatured({ nftId, rationale }, ctx) {
        const em = await this.em();
        const { user } = ctx;
        return (0, sql_1.withHiddenEntities)(em, async () => {
            const nft = await em.findOne(model_1.OwnedNft, {
                where: { id: nftId },
            });
            if (!nft) {
                throw new Error(`NFT with id ${nftId} not found!`);
            }
            const existingRequest = await em.findOne(model_1.NftFeaturingRequest, {
                where: { userId: user.id, nftId },
            });
            if (existingRequest) {
                return {
                    id: existingRequest.id,
                    nftId,
                    created: false,
                    createdAt: existingRequest.timestamp,
                    rationale: existingRequest.rationale,
                };
            }
            const newRequest = new model_1.NftFeaturingRequest({
                id: (0, crypto_1.uniqueId)(8),
                nftId,
                rationale,
                timestamp: new Date(),
                userId: user.id,
            });
            await em.save(newRequest);
            return {
                id: newRequest.id,
                nftId,
                created: true,
                createdAt: newRequest.timestamp,
                rationale,
            };
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [baseTypes_1.OwnedNft]),
    __param(0, (0, type_graphql_1.Args)()),
    __param(1, (0, type_graphql_1.Info)()),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.EndingAuctionsNftsArgs, Object, Object]),
    __metadata("design:returntype", Promise)
], NftResolver.prototype, "endingAuctionsNfts", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.NftFeaturedRequstInfo),
    __param(0, (0, type_graphql_1.Args)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.RequestFeaturedNftArgs, Object]),
    __metadata("design:returntype", Promise)
], NftResolver.prototype, "requestNftFeatured", null);
NftResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], NftResolver);
exports.NftResolver = NftResolver;
//# sourceMappingURL=index.js.map