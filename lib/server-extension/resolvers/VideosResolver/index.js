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
exports.VideosResolver = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const types_1 = require("./types");
const baseTypes_1 = require("../baseTypes");
const model_1 = require("../../../model");
const util_1 = require("@subsquid/openreader/lib/util/util");
const apollo_server_core_1 = require("apollo-server-core");
const orderBy_1 = require("@subsquid/openreader/lib/opencrud/orderBy");
const where_1 = require("@subsquid/openreader/lib/opencrud/where");
const connection_1 = require("@subsquid/openreader/lib/ir/connection");
const resolve_tree_1 = require("@subsquid/openreader/lib/util/resolve-tree");
const model_2 = require("../model");
const tree_1 = require("@subsquid/openreader/lib/opencrud/tree");
const limit_size_1 = require("@subsquid/openreader/lib/limit.size");
const query_1 = require("@subsquid/openreader/lib//sql/query");
const sql_1 = require("../../../utils/sql");
const config_1 = require("../../../utils/config");
const lodash_1 = require("lodash");
const misc_1 = require("../../../utils/misc");
const utils_1 = require("../../../mappings/utils");
const crypto_1 = require("../../../utils/crypto");
const middleware_1 = require("../middleware");
let VideosResolver = class VideosResolver {
    // Set by depenency injection
    constructor(em) {
        this.em = em;
    }
    async mostViewedVideosConnection(args, info, ctx) {
        const typeName = 'Video';
        const outputType = 'VideosConnection';
        const edgeType = 'VideoEdge';
        if (args.limit > 1000) {
            throw new Error('The limit cannot exceed 1000');
        }
        // Validation based on '@subsquid/openreader/src/opencrud/schema.ts'
        const orderByArg = (0, util_1.ensureArray)(args.orderBy);
        if (orderByArg.length === 0) {
            throw new apollo_server_core_1.UserInputError('orderBy argument is required for connection');
        }
        const req = {
            orderBy: (0, orderBy_1.parseOrderBy)(model_2.model, typeName, orderByArg),
            where: (0, where_1.parseWhere)(args.where),
        };
        if (args.first !== null && args.first !== undefined) {
            if (args.first < 0) {
                throw new apollo_server_core_1.UserInputError("'first' argument of connection can't be less than 0");
            }
            else {
                req.first = args.first;
            }
        }
        if (args.after !== null && args.after !== undefined) {
            if ((0, connection_1.decodeRelayConnectionCursor)(args.after) == null) {
                throw new apollo_server_core_1.UserInputError(`invalid cursor value: ${args.after}`);
            }
            else {
                req.after = args.after;
            }
        }
        const tree = (0, resolve_tree_1.getResolveTree)(info, outputType);
        req.totalCount = (0, resolve_tree_1.hasTreeRequest)(tree.fields, 'totalCount');
        req.pageInfo = (0, resolve_tree_1.hasTreeRequest)(tree.fields, 'pageInfo');
        const edgesTree = (0, resolve_tree_1.getTreeRequest)(tree.fields, 'edges');
        if (edgesTree) {
            const edgeFields = (0, resolve_tree_1.simplifyResolveTree)(info.schema, edgesTree, edgeType).fields;
            req.edgeCursor = (0, resolve_tree_1.hasTreeRequest)(edgeFields, 'cursor');
            const nodeTree = (0, resolve_tree_1.getTreeRequest)(edgeFields, 'node');
            if (nodeTree) {
                req.edgeNode = (0, tree_1.parseAnyTree)(model_2.model, typeName, info.schema, nodeTree);
            }
        }
        ctx.openreader.responseSizeLimit?.check(() => (0, limit_size_1.getConnectionSize)(model_2.model, typeName, req) + 1);
        const idsQuery = new query_1.CountQuery(model_2.model, ctx.openreader.dialect, typeName, req.where);
        let idsQuerySql = idsQuery.sql;
        idsQuerySql = (0, sql_1.extendClause)(idsQuerySql, 'FROM', `LEFT JOIN "admin"."video_view_event" ` +
            `ON "video_view_event"."video_id" = "video"."id"` +
            (args.periodDays
                ? ` AND "video_view_event"."timestamp" > '${new Date(Date.now() - args.periodDays * 24 * 60 * 60 * 1000).toISOString()}'`
                : ''), '');
        idsQuerySql = (0, sql_1.overrideClause)(idsQuerySql, 'GROUP BY', '"video"."id"');
        idsQuerySql = (0, sql_1.overrideClause)(idsQuerySql, 'ORDER BY', 'COUNT("video_view_event"."id") DESC');
        idsQuerySql = (0, sql_1.overrideClause)(idsQuerySql, 'SELECT', '"video"."id"');
        idsQuerySql = (0, sql_1.overrideClause)(idsQuerySql, 'LIMIT', `${args.limit}`);
        const em = await this.em();
        const results = await em.query(idsQuerySql, idsQuery.params);
        let ids = results.flatMap((r) => (0, lodash_1.isObject)(r) && (0, misc_1.has)(r, 'id') && typeof r.id === 'string' ? [r.id] : []);
        if (ids.length === 0) {
            ids = ['-1'];
        }
        const connectionQuery = new query_1.ConnectionQuery(model_2.model, ctx.openreader.dialect, typeName, req);
        let connectionQuerySql;
        connectionQuerySql = (0, sql_1.extendClause)(connectionQuery.sql, 'WHERE', `"video"."id" IN (${ids.map((id) => `'${id}'`).join(', ')})`, 'AND');
        const hasPeriodDaysArgAndIsOrderedByViews = args.periodDays &&
            (args.orderBy.find((orderByArg) => orderByArg === 'viewsNum_DESC') ||
                args.orderBy.find((orderByArg) => orderByArg === 'viewsNum_ASC'));
        if (hasPeriodDaysArgAndIsOrderedByViews) {
            const arrayPosition = `array_position(
        array[${ids.map((id) => `'${id}'`).join(', ')}],
        video.id  
      )`;
            connectionQuerySql = connectionQuerySql.replace('"video"."views_num" DESC', `${arrayPosition} ASC`);
            connectionQuerySql = connectionQuerySql.replace('"video"."views_num" ASC', `${arrayPosition} DESC`);
        }
        // Override the raw `sql` string in `connectionQuery` with the modified query
        ;
        connectionQuery.sql = connectionQuerySql;
        console.log('connectionQuery', connectionQuerySql);
        const result = await ctx.openreader.executeQuery(connectionQuery);
        if (req.totalCount && result.totalCount == null) {
            const countQuery = new query_1.CountQuery(model_2.model, ctx.openreader.dialect, typeName, req.where);
            const countQuerySql = (0, sql_1.extendClause)(countQuery.sql, 'WHERE', `"video"."id" IN (${ids.map((id) => `'${id}'`).join(', ')})`, 'AND');
            countQuery.sql = countQuerySql;
            console.log('countQuery', countQuerySql);
            result.totalCount = await ctx.openreader.executeQuery(countQuery);
        }
        return result;
    }
    async addVideoView(videoId, ctx) {
        const em = await this.em();
        const { user } = ctx;
        return (0, sql_1.withHiddenEntities)(em, async () => {
            // Check if the video actually exists & lock it for update
            const video = await em.findOne(model_1.Video, {
                where: { id: videoId },
                lock: { mode: 'pessimistic_write' },
                join: {
                    alias: 'v',
                    innerJoinAndSelect: {
                        c: 'v.channel',
                    },
                },
            });
            if (!video) {
                throw new Error(`Video by id ${videoId} does not exist`);
            }
            // See if there is already a recent view of this video by this user
            const timeLimitInSeconds = await config_1.config.get(config_1.ConfigVariable.VideoViewPerUserTimeLimit, em);
            const recentView = await em.findOne(model_1.VideoViewEvent, {
                where: {
                    userId: user.id,
                    videoId,
                    timestamp: (0, typeorm_1.MoreThan)(new Date(Date.now() - timeLimitInSeconds * 1000)),
                },
            });
            // If so - just return the result
            if (recentView) {
                return {
                    videoId,
                    viewsNum: video.viewsNum,
                    viewId: recentView.id,
                    added: false,
                };
            }
            // Otherwise create a new VideoViewEvent and increase the videoViews counter
            // in both the video and its channel
            video.viewsNum += 1;
            video.channel.videoViewsNum += 1;
            const newView = new model_1.VideoViewEvent({
                id: `${videoId}-${video.viewsNum}`,
                userId: user.id,
                timestamp: new Date(),
                videoId,
            });
            const tick = await config_1.config.get(config_1.ConfigVariable.VideoRelevanceViewsTick, em);
            if (video.viewsNum % tick === 0) {
                utils_1.videoRelevanceManager.scheduleRecalcForVideo(videoId);
            }
            await em.save([video, video.channel, newView]);
            await utils_1.videoRelevanceManager.updateVideoRelevanceValue(em);
            return {
                videoId,
                viewsNum: video.viewsNum,
                viewId: newView.id,
                added: true,
            };
        });
    }
    async reportVideo({ videoId, rationale }, ctx) {
        const em = await this.em();
        const { user } = ctx;
        return (0, sql_1.withHiddenEntities)(em, async () => {
            // Try to retrieve the video+channel first
            const video = await em.findOne(model_1.Video, {
                where: { id: videoId },
                relations: { channel: true },
            });
            if (!video) {
                throw new Error(`Video by id ${videoId} not found!`);
            }
            // Check if the user has already reported this video
            const existingReport = await em.findOne(model_1.Report, {
                where: { userId: user.id, videoId },
            });
            // If report already exists - return its data with { created: false }
            if (existingReport) {
                return {
                    id: existingReport.id,
                    videoId,
                    created: false,
                    createdAt: existingReport.timestamp,
                    rationale: existingReport.rationale,
                };
            }
            // If report doesn't exist, create a new one
            const newReport = new model_1.Report({
                id: (0, crypto_1.uniqueId)(8),
                videoId,
                channelId: video.channel.id,
                userId: user.id,
                rationale,
                timestamp: new Date(),
            });
            await em.save(newReport);
            return {
                id: newReport.id,
                videoId,
                created: true,
                createdAt: newReport.timestamp,
                rationale,
            };
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => baseTypes_1.VideosConnection),
    __param(0, (0, type_graphql_1.Args)()),
    __param(1, (0, type_graphql_1.Info)()),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.MostViewedVideosConnectionArgs, Object, Object]),
    __metadata("design:returntype", Promise)
], VideosResolver.prototype, "mostViewedVideosConnection", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(middleware_1.UserOnly),
    (0, type_graphql_1.Mutation)(() => types_1.AddVideoViewResult),
    __param(0, (0, type_graphql_1.Arg)('videoId', () => String, { nullable: false })),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideosResolver.prototype, "addVideoView", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(middleware_1.UserOnly),
    (0, type_graphql_1.Mutation)(() => types_1.VideoReportInfo),
    __param(0, (0, type_graphql_1.Args)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.ReportVideoArgs, Object]),
    __metadata("design:returntype", Promise)
], VideosResolver.prototype, "reportVideo", null);
VideosResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], VideosResolver);
exports.VideosResolver = VideosResolver;
//# sourceMappingURL=index.js.map