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
exports.ChannelsResolver = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const types_1 = require("./types");
const model_1 = require("../../../model");
const sql_1 = require("../../../utils/sql");
const utils_1 = require("./utils");
const tree_1 = require("@subsquid/openreader/lib/opencrud/tree");
const resolve_tree_1 = require("@subsquid/openreader/lib/util/resolve-tree");
const query_1 = require("@subsquid/openreader/lib/sql/query");
const model_2 = require("../model");
const crypto_1 = require("../../../utils/crypto");
const middleware_1 = require("../middleware");
let ChannelsResolver = class ChannelsResolver {
    // Set by depenency injection
    constructor(em) {
        this.em = em;
    }
    async extendedChannels(args, info, ctx) {
        const listQuery = (0, utils_1.buildExtendedChannelsQuery)(args, info, ctx);
        const result = await ctx.openreader.executeQuery(listQuery);
        return result;
    }
    async mostRecentChannels(args, info, ctx) {
        const listQuery = (0, utils_1.buildExtendedChannelsQuery)({
            where: args.where,
            orderBy: args.orderBy,
            limit: args.resultsLimit,
        }, info, ctx);
        const mostRecentChannelsQuerySql = `
      SELECT "id" FROM "channel" ORDER BY "created_at" DESC LIMIT ${args.mostRecentLimit}
    `;
        const listQuerySql = (0, sql_1.extendClause)(listQuery.sql, 'WHERE', `"channel"."id" IN (${mostRecentChannelsQuerySql})`, 'AND');
        listQuery.sql = listQuerySql;
        const result = await ctx.openreader.executeQuery(listQuery);
        console.log('Result', result);
        return result;
    }
    async topSellingChannels(args, info, ctx) {
        const listQuery = (0, utils_1.buildTopSellingChannelsQuery)(args, info, ctx);
        const result = await ctx.openreader.executeQuery(listQuery);
        return result;
    }
    async channelNftCollectors(args, info, ctx) {
        const tree = (0, resolve_tree_1.getResolveTree)(info);
        // Extract subsquid-supported Membership fields
        const membershipSubTree = tree.fieldsByTypeName.ChannelNftCollector.member;
        const membershipFields = (0, tree_1.parseAnyTree)(model_2.model, 'Membership', info.schema, membershipSubTree);
        // Generate query using subsquid's ListQuery
        const listQuery = new query_1.ListQuery(model_2.model, ctx.openreader.dialect, 'Membership', membershipFields, {
            limit: args.limit,
        });
        let listQuerySql = listQuery.sql;
        listQuerySql = (0, sql_1.extendClause)(listQuerySql, 'SELECT', '"collectors"."nft_count"');
        listQuerySql = (0, sql_1.extendClause)(listQuerySql, 'FROM', `
        INNER JOIN (
          SELECT
              owned_nft.owner->>'member' AS member_id,
              COUNT(owned_nft.id) AS nft_count
          FROM
              channel
              INNER JOIN video ON video.channel_id = channel.id
              INNER JOIN owned_nft ON owned_nft.video_id = video.id
          WHERE channel.id = $${listQuery.params.length + 1}
          GROUP BY owned_nft.owner->>'member'
          HAVING COUNT(owned_nft.id) > 0
        ) AS collectors ON collectors.member_id = membership.id
      `, '');
        listQuery.params.push(args.channelId);
        if (args.orderBy !== undefined) {
            listQuerySql = (0, sql_1.extendClause)(listQuerySql, 'ORDER BY', args.orderBy === types_1.ChannelNftCollectorsOrderByInput.amount_ASC
                ? '"nft_count" ASC'
                : '"nft_count" DESC');
        }
        ;
        listQuery.sql = listQuerySql;
        const oldListQMap = listQuery.map.bind(listQuery);
        listQuery.map = (rows) => {
            const nftCounts = [];
            for (const row of rows) {
                nftCounts.push(row.pop());
            }
            const membersMapped = oldListQMap(rows);
            return membersMapped.map((member, i) => ({ member, amount: nftCounts[i] }));
        };
        const result = await ctx.openreader.executeQuery(listQuery);
        console.log('Result', result);
        return result;
    }
    async followChannel({ channelId }, ctx) {
        const em = await this.em();
        const { user } = ctx;
        return (0, sql_1.withHiddenEntities)(em, async () => {
            // Try to retrieve the channel and lock it for update
            const channel = await em.findOne(model_1.Channel, {
                where: { id: channelId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!channel) {
                throw new Error(`Channel by id ${channelId} not found!`);
            }
            // Check whether the user already follows the channel
            const existingFollow = await em.findOne(model_1.ChannelFollow, {
                where: { channelId, userId: user.id },
            });
            // If so - just return the result
            if (existingFollow) {
                return {
                    channelId,
                    followId: existingFollow.id,
                    follows: channel.followsNum,
                    added: false,
                };
            }
            // Otherwise add a new follow
            channel.followsNum += 1;
            const newFollow = new model_1.ChannelFollow({
                id: (0, crypto_1.uniqueId)(8),
                channelId,
                userId: user.id,
                timestamp: new Date(),
            });
            await em.save([channel, newFollow]);
            return {
                channelId,
                follows: channel.followsNum,
                followId: newFollow.id,
                added: true,
            };
        });
    }
    async unfollowChannel({ channelId }, ctx) {
        const em = await this.em();
        const { user } = ctx;
        return (0, sql_1.withHiddenEntities)(em, async () => {
            // Try to retrieve the channel and lock it for update
            const channel = await em.findOne(model_1.Channel, {
                where: { id: channelId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!channel) {
                throw new Error(`Channel by id ${channelId} not found!`);
            }
            // Check if there's a follow matching the request data
            const follow = await em.findOne(model_1.ChannelFollow, {
                where: { channelId, userId: user.id },
            });
            // If not - just return the current number of follows
            if (!follow) {
                return { channelId, follows: channel.followsNum, removed: false };
            }
            // Otherwise remove the follow
            channel.followsNum -= 1;
            await Promise.all([em.remove(follow), em.save(channel)]);
            return { channelId, follows: channel.followsNum, removed: true };
        });
    }
    async reportChannel({ channelId, rationale }, ctx) {
        const em = await this.em();
        const { user } = ctx;
        return (0, sql_1.withHiddenEntities)(em, async () => {
            // Try to retrieve the channel first
            const channel = await em.findOne(model_1.Channel, {
                where: { id: channelId },
            });
            if (!channel) {
                throw new Error(`Channel by id ${channelId} not found!`);
            }
            // Check whether the user already reported the channel
            const existingReport = await em.findOne(model_1.Report, {
                where: { channelId, videoId: (0, typeorm_1.IsNull)(), userId: user.id },
            });
            // If report already exists - return its data with { created: false }
            if (existingReport) {
                return {
                    id: existingReport.id,
                    channelId,
                    created: false,
                    createdAt: existingReport.timestamp,
                    rationale: existingReport.rationale,
                };
            }
            // If report doesn't exist, create a new one
            const newReport = new model_1.Report({
                id: (0, crypto_1.uniqueId)(8),
                channelId,
                userId: user.id,
                rationale,
                timestamp: new Date(),
            });
            await em.save(newReport);
            return {
                id: newReport.id,
                channelId,
                created: true,
                createdAt: newReport.timestamp,
                rationale,
            };
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [types_1.ExtendedChannel]),
    __param(0, (0, type_graphql_1.Args)()),
    __param(1, (0, type_graphql_1.Info)()),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.ExtendedChannelsArgs, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsResolver.prototype, "extendedChannels", null);
__decorate([
    (0, type_graphql_1.Query)(() => [types_1.ExtendedChannel]),
    __param(0, (0, type_graphql_1.Args)()),
    __param(1, (0, type_graphql_1.Info)()),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.MostRecentChannelsArgs, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsResolver.prototype, "mostRecentChannels", null);
__decorate([
    (0, type_graphql_1.Query)(() => [types_1.TopSellingChannelsResult]),
    __param(0, (0, type_graphql_1.Args)()),
    __param(1, (0, type_graphql_1.Info)()),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.TopSellingChannelsArgs, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsResolver.prototype, "topSellingChannels", null);
__decorate([
    (0, type_graphql_1.Query)(() => [types_1.ChannelNftCollector]),
    __param(0, (0, type_graphql_1.Args)()),
    __param(1, (0, type_graphql_1.Info)()),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.ChannelNftCollectorsArgs, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsResolver.prototype, "channelNftCollectors", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.ChannelFollowResult),
    (0, type_graphql_1.UseMiddleware)(middleware_1.AccountOnly),
    __param(0, (0, type_graphql_1.Args)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.FollowChannelArgs, Object]),
    __metadata("design:returntype", Promise)
], ChannelsResolver.prototype, "followChannel", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.ChannelUnfollowResult),
    (0, type_graphql_1.UseMiddleware)(middleware_1.AccountOnly),
    __param(0, (0, type_graphql_1.Args)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.UnfollowChannelArgs, Object]),
    __metadata("design:returntype", Promise)
], ChannelsResolver.prototype, "unfollowChannel", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(middleware_1.UserOnly),
    (0, type_graphql_1.Mutation)(() => types_1.ChannelReportInfo),
    __param(0, (0, type_graphql_1.Args)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.ReportChannelArgs, Object]),
    __metadata("design:returntype", Promise)
], ChannelsResolver.prototype, "reportChannel", null);
ChannelsResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], ChannelsResolver);
exports.ChannelsResolver = ChannelsResolver;
//# sourceMappingURL=index.js.map