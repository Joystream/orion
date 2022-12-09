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
exports.AdminResolver = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const types_1 = require("./types");
const config_1 = require("../../../utils/config");
const middleware_1 = require("../middleware");
const model_1 = require("../../../model");
const tree_1 = require("@subsquid/openreader/lib/opencrud/tree");
const resolve_tree_1 = require("@subsquid/openreader/lib/util/resolve-tree");
const query_1 = require("@subsquid/openreader/lib/sql/query");
const limit_size_1 = require("@subsquid/openreader/lib/limit.size");
const baseTypes_1 = require("../baseTypes");
const model_2 = require("../model");
const util_crypto_1 = require("@polkadot/util-crypto");
const util_1 = require("@polkadot/util");
const utils_1 = require("@joystream/js/utils");
const metadata_protobuf_1 = require("@joystream/metadata-protobuf");
const sql_1 = require("../../../utils/sql");
const utils_2 = require("./utils");
const utils_3 = require("../../../mappings/utils");
let AdminResolver = class AdminResolver {
    // Set by depenency injection
    constructor(em) {
        this.em = em;
    }
    async setVideoWeights(args) {
        const em = await this.em();
        await config_1.config.set(config_1.ConfigVariable.RelevanceWeights, [
            args.newnessWeight,
            args.viewsWeight,
            args.commentsWeight,
            args.reactionsWeight,
            [args.joysteamTimestampSubWeight, args.ytTimestampSubWeight],
        ], em);
        await utils_3.videoRelevanceManager.updateVideoRelevanceValue(em, true);
        return { isApplied: true };
    }
    async setKillSwitch(args) {
        const em = await this.em();
        await config_1.config.set(config_1.ConfigVariable.KillSwitch, args.isKilled, em);
        return { isKilled: await config_1.config.get(config_1.ConfigVariable.KillSwitch, em) };
    }
    async getKillSwitch() {
        const em = await this.em();
        return { isKilled: await config_1.config.get(config_1.ConfigVariable.KillSwitch, em) };
    }
    async setVideoViewPerUserTimeLimit(args) {
        const em = await this.em();
        await config_1.config.set(config_1.ConfigVariable.VideoViewPerUserTimeLimit, args.limitInSeconds, em);
        return {
            limitInSeconds: await config_1.config.get(config_1.ConfigVariable.VideoViewPerUserTimeLimit, em),
        };
    }
    async videoHero(info, ctx) {
        const tree = (0, resolve_tree_1.getResolveTree)(info);
        const fields = (0, tree_1.parseObjectTree)(model_2.model, 'VideoHero', info.schema, tree);
        ctx.openreader.responseSizeLimit?.check(() => (0, limit_size_1.getObjectSize)(model_2.model, fields) + 1);
        const em = await this.em();
        const { id: currentHeroId } = (await em.getRepository(model_1.VideoHero).find({
            select: { id: true },
            order: { activatedAt: 'DESC' },
            take: 1,
        }))[0] || {};
        if (currentHeroId === undefined) {
            return undefined;
        }
        const entityByIdQuery = new query_1.EntityByIdQuery(model_2.model, ctx.openreader.dialect, 'VideoHero', fields, currentHeroId);
        return ctx.openreader.executeQuery(entityByIdQuery);
    }
    async setVideoHero(args) {
        const em = await this.em();
        const [currentHero] = await em.getRepository(model_1.VideoHero).find({
            order: { activatedAt: 'DESC' },
            take: 1,
        });
        // Create sequential id
        const id = (parseInt(currentHero?.id || '0', 36) + 1).toString(36);
        const videoHero = new model_1.VideoHero({
            id,
            activatedAt: new Date(),
            heroPosterUrl: args.heroPosterUrl,
            heroTitle: args.heroTitle,
            heroVideoCutUrl: args.videoCutUrl,
            video: new model_1.Video({ id: args.videoId }),
        });
        await em.save(videoHero);
        return { id };
    }
    async setCategoryFeaturedVideos(args) {
        const em = await this.em();
        const { categoryId } = args;
        const deleteResult = await em.getRepository(model_1.VideoFeaturedInCategory).delete({
            category: {
                id: categoryId,
            },
            video: {
                id: (0, typeorm_1.Not)((0, typeorm_1.In)(args.videos.map((v) => v.videoId))),
            },
        });
        const numberOfFeaturedVideosUnset = deleteResult.affected || 0;
        const newRows = args.videos.map(({ videoId, videoCutUrl }) => new model_1.VideoFeaturedInCategory({
            id: `${videoId}-${categoryId}`,
            category: new model_1.VideoCategory({ id: categoryId }),
            video: new model_1.Video({ id: videoId }),
            videoCutUrl,
        }));
        await em.save(newRows);
        return {
            categoryId,
            numberOfFeaturedVideosSet: newRows.length,
            numberOfFeaturedVideosUnset,
        };
    }
    async setSupportedCategories({ supportNewCategories, supportNoCategoryVideos, supportedCategoriesIds, }) {
        const em = await this.em();
        let newNumberOfCategoriesSupported = 0;
        if (supportedCategoriesIds) {
            await em
                .createQueryBuilder()
                .update(`admin.video_category`)
                .set({ is_supported: false })
                .execute();
            if (supportedCategoriesIds.length) {
                const result = await em
                    .createQueryBuilder()
                    .update(`admin.video_category`)
                    .set({ is_supported: true })
                    .where({ id: (0, typeorm_1.In)(supportedCategoriesIds) })
                    .execute();
                newNumberOfCategoriesSupported = result.affected || 0;
            }
        }
        if (supportNewCategories !== undefined) {
            await config_1.config.set(config_1.ConfigVariable.SupportNewCategories, supportNewCategories, em);
        }
        if (supportNoCategoryVideos !== undefined) {
            await config_1.config.set(config_1.ConfigVariable.SupportNoCategoryVideo, supportNoCategoryVideos, em);
        }
        return {
            newNumberOfCategoriesSupported,
            newlyCreatedCategoriesSupported: await config_1.config.get(config_1.ConfigVariable.SupportNewCategories, em),
            noCategoryVideosSupported: await config_1.config.get(config_1.ConfigVariable.SupportNoCategoryVideo, em),
        };
    }
    async setFeaturedNfts({ featuredNftsIds }) {
        const em = await this.em();
        let newNumberOfNftsFeatured = 0;
        await em
            .createQueryBuilder()
            .update(`admin.owned_nft`)
            .set({ is_featured: false })
            .where({ is_featured: true })
            .execute();
        if (featuredNftsIds.length) {
            const result = await em
                .createQueryBuilder()
                .update(`admin.owned_nft`)
                .set({ is_featured: true })
                .where({ id: (0, typeorm_1.In)(featuredNftsIds) })
                .execute();
            newNumberOfNftsFeatured = result.affected || 0;
        }
        return {
            newNumberOfNftsFeatured,
        };
    }
    async excludeContent({ ids, type }) {
        const em = await this.em();
        return (0, sql_1.withHiddenEntities)(em, async () => {
            const result = await em
                .createQueryBuilder()
                .update(type)
                .set({ isExcluded: true })
                .where({ id: (0, typeorm_1.In)(ids) })
                .execute();
            if (type === types_1.ExcludableContentType.Comment) {
                await (0, utils_2.processCommentsCensorshipStatusUpdate)(em, ids);
            }
            return {
                numberOfEntitiesAffected: result.affected || 0,
            };
        });
    }
    async restoreContent({ ids, type }) {
        const em = await this.em();
        return (0, sql_1.withHiddenEntities)(em, async () => {
            const result = await em
                .createQueryBuilder()
                .update(type)
                .set({ isExcluded: false })
                .where({ id: (0, typeorm_1.In)(ids) })
                .execute();
            if (type === types_1.ExcludableContentType.Comment) {
                await (0, utils_2.processCommentsCensorshipStatusUpdate)(em, ids);
            }
            return {
                numberOfEntitiesAffected: result.affected || 0,
            };
        });
    }
    async signAppActionCommitment(
    // FIXME: In the initial implementation we require the user to provide the nonce
    // and don't verify it in any way, but this should be changed in the future
    { nonce, rawAction, assets, creatorId, actionType }) {
        const em = await this.em();
        if (!(0, util_1.isHex)(assets) || !(0, util_1.isHex)(rawAction)) {
            throw new Error('One of input is not hex: assets, rawAction');
        }
        const message = (0, utils_1.generateAppActionCommitment)(nonce, `${creatorId}`, actionType, actionType === metadata_protobuf_1.AppAction.ActionType.CREATE_CHANNEL
            ? metadata_protobuf_1.AppAction.CreatorType.MEMBER // only members are supported as channel owners for now
            : metadata_protobuf_1.AppAction.CreatorType.CHANNEL, (0, util_1.hexToU8a)(assets), (0, util_1.hexToU8a)(rawAction));
        const appKeypair = (0, util_crypto_1.ed25519PairFromString)(await config_1.config.get(config_1.ConfigVariable.AppPrivateKey, em));
        const signature = (0, util_crypto_1.ed25519Sign)(message, appKeypair);
        return { signature: (0, util_1.u8aToHex)(signature) };
    }
};
__decorate([
    (0, type_graphql_1.UseMiddleware)(middleware_1.OperatorOnly),
    (0, type_graphql_1.Mutation)(() => types_1.VideoWeights),
    __param(0, (0, type_graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.SetVideoWeightsInput]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "setVideoWeights", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(middleware_1.OperatorOnly),
    (0, type_graphql_1.Mutation)(() => types_1.KillSwitch),
    __param(0, (0, type_graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.SetKillSwitchInput]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "setKillSwitch", null);
__decorate([
    (0, type_graphql_1.Query)(() => types_1.KillSwitch),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "getKillSwitch", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(middleware_1.OperatorOnly),
    (0, type_graphql_1.Mutation)(() => types_1.VideoViewPerUserTimeLimit),
    __param(0, (0, type_graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.SetVideoViewPerUserTimeLimitInput]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "setVideoViewPerUserTimeLimit", null);
__decorate([
    (0, type_graphql_1.Query)(() => baseTypes_1.VideoHero, { nullable: true }),
    __param(0, (0, type_graphql_1.Info)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "videoHero", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(middleware_1.OperatorOnly),
    (0, type_graphql_1.Mutation)(() => types_1.SetVideoHeroResult),
    __param(0, (0, type_graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.SetVideoHeroInput]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "setVideoHero", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(middleware_1.OperatorOnly),
    (0, type_graphql_1.Mutation)(() => types_1.SetCategoryFeaturedVideosResult),
    __param(0, (0, type_graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.SetCategoryFeaturedVideosArgs]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "setCategoryFeaturedVideos", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(middleware_1.OperatorOnly),
    (0, type_graphql_1.Mutation)(() => types_1.SetSupportedCategoriesResult),
    __param(0, (0, type_graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.SetSupportedCategoriesInput]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "setSupportedCategories", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(middleware_1.OperatorOnly),
    (0, type_graphql_1.Mutation)(() => types_1.SetFeaturedNftsResult),
    __param(0, (0, type_graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.SetFeaturedNftsInput]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "setFeaturedNfts", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(middleware_1.OperatorOnly),
    (0, type_graphql_1.Mutation)(() => types_1.ExcludeContentResult),
    __param(0, (0, type_graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.ExcludeContentArgs]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "excludeContent", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(middleware_1.OperatorOnly),
    (0, type_graphql_1.Mutation)(() => types_1.RestoreContentResult),
    __param(0, (0, type_graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.RestoreContentArgs]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "restoreContent", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.GeneratedSignature),
    __param(0, (0, type_graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.AppActionSignatureInput]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "signAppActionCommitment", null);
AdminResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], AdminResolver);
exports.AdminResolver = AdminResolver;
//# sourceMappingURL=index.js.map