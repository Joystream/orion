"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRelevanceManager = exports.NEWNESS_SECONDS_DIVIDER = void 0;
const config_1 = require("./config");
const globalEm_1 = require("./globalEm");
// constant used to parse seconds from creation
exports.NEWNESS_SECONDS_DIVIDER = 60 * 60 * 24;
class VideoRelevanceManager {
    constructor() {
        this.videosToUpdate = new Set();
    }
    init(intervalMs) {
        this.updateLoop(intervalMs)
            .then(() => {
            /* Do nothing */
        })
            .catch((err) => {
            console.error(err);
            process.exit(-1);
        });
    }
    scheduleRecalcForVideo(id) {
        id && this.videosToUpdate.add(id);
    }
    async updateVideoRelevanceValue(em, forceUpdateAll) {
        if (this.videosToUpdate.size || forceUpdateAll) {
            const [newnessWeight, viewsWeight, commentsWeight, reactionsWeight, [joystreamTimestampWeight, ytTimestampWeight] = [7, 3],] = await config_1.config.get(config_1.ConfigVariable.RelevanceWeights, em);
            await em.query(`
        WITH weighted_timestamp AS (
    SELECT 
        id,
        (
          extract(epoch from created_at)*${joystreamTimestampWeight} +
          COALESCE(extract(epoch from published_before_joystream), extract(epoch from created_at))*${ytTimestampWeight}
        ) / ${joystreamTimestampWeight + ytTimestampWeight} as wtEpoch
    FROM 
        "video" 
        ${forceUpdateAll
                ? ''
                : `WHERE "id" IN (${[...this.videosToUpdate.values()]
                    .map((id) => `'${id}'`)
                    .join(', ')})`}
        )
    UPDATE 
        "video"
    SET
        "video_relevance" = ROUND(
        (extract(epoch from now()) - wtEpoch) / (60 * 60 * 24) * ${newnessWeight * -1} +
        (views_num * ${viewsWeight}) +
        (comments_count * ${commentsWeight}) +
        (reactions_count * ${reactionsWeight}), 
            2)
    FROM
        weighted_timestamp
    WHERE
        "video".id = weighted_timestamp.id;
        `);
            this.videosToUpdate.clear();
        }
    }
    async updateLoop(intervalMs) {
        const em = await globalEm_1.globalEm;
        while (true) {
            await this.updateVideoRelevanceValue(em, true);
            await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }
    }
}
exports.VideoRelevanceManager = VideoRelevanceManager;
//# sourceMappingURL=VideoRelevanceManager.js.map