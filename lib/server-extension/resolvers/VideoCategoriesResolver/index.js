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
exports.VideoCategoriesResolver = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const types_1 = require("./types");
const tree_1 = require("@subsquid/openreader/lib/opencrud/tree");
const resolve_tree_1 = require("@subsquid/openreader/lib/util/resolve-tree");
const query_1 = require("@subsquid/openreader/lib/sql/query");
const model_1 = require("../model");
const sql_1 = require("../../../utils/sql");
let VideoCategoriesResolver = class VideoCategoriesResolver {
    // Set by depenency injection
    constructor(tx) {
        this.tx = tx;
    }
    async extendedVideoCategories(info, ctx) {
        const tree = (0, resolve_tree_1.getResolveTree)(info);
        // Extract subsquid-supported VideoCategory fields
        const videoCategorySubTree = tree.fieldsByTypeName.ExtendedVideoCategory.category;
        const videoCategoryFields = (0, tree_1.parseAnyTree)(model_1.model, 'VideoCategory', info.schema, videoCategorySubTree);
        // Generate query using subsquid's ListQuery
        const listQuery = new query_1.ListQuery(model_1.model, ctx.openreader.dialect, 'VideoCategory', videoCategoryFields, {});
        let listQuerySql = listQuery.sql;
        // Define a subquery to fetch active videos count
        const activeVideosCountQuerySql = `
      SELECT
        "category_id",
        COUNT("video"."id") AS "activeVideosCount"
      FROM
        "video"
        INNER JOIN "storage_data_object" AS "media" ON "media"."id" = "video"."media_id"
        INNER JOIN "storage_data_object" AS "thumbnail" ON "thumbnail"."id" = "video"."thumbnail_photo_id"
      WHERE
        "video"."is_censored" = '0'
        AND "video"."is_public" = '1'
        AND "media"."is_accepted" = '1'
        AND "thumbnail"."is_accepted" = '1'
        AND "category_id" IS NOT NULL
      GROUP BY "category_id"
    `;
        // Extend SELECT clause of the original query
        listQuerySql = (0, sql_1.extendClause)(listQuerySql, 'SELECT', 'COALESCE("activeVideoCounter"."activeVideosCount", 0) AS "activeVideosCount"');
        // Extend FROM clause of the original query
        listQuerySql = (0, sql_1.extendClause)(listQuerySql, 'FROM', `LEFT OUTER JOIN (${activeVideosCountQuerySql}) AS "activeVideoCounter"
        ON "activeVideoCounter"."category_id" = "video_category"."id"`, '');
        listQuery.sql = listQuerySql;
        // Override the `listQuery.map` function
        const oldListQMap = listQuery.map.bind(listQuery);
        listQuery.map = (rows) => {
            const activeVideoCounts = [];
            for (const row of rows) {
                activeVideoCounts.push(row.pop());
            }
            const categoriesMapped = oldListQMap(rows);
            return categoriesMapped.map((category, i) => ({
                category,
                activeVideosCount: activeVideoCounts[i],
            }));
        };
        const result = await ctx.openreader.executeQuery(listQuery);
        console.log('Result', result);
        return result;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [types_1.ExtendedVideoCategory]),
    __param(0, (0, type_graphql_1.Info)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VideoCategoriesResolver.prototype, "extendedVideoCategories", null);
VideoCategoriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], VideoCategoriesResolver);
exports.VideoCategoriesResolver = VideoCategoriesResolver;
//# sourceMappingURL=index.js.map