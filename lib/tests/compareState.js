"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareState = void 0;
const core_1 = require("@apollo/client/core");
const lodash_1 = __importDefault(require("lodash"));
const misc_1 = require("../utils/misc");
const queries_1 = require("./v1/generated/queries");
const queries_2 = require("./v2/generated/queries");
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const util_1 = require("util");
function normalizeDeep(obj, callback, path = '') {
    for (const [key, val] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        const res = callback(currentPath, val, { ...obj });
        if (res !== undefined) {
            delete obj[key];
            normalizeDeep(res, callback, path);
            Object.assign(obj, res);
        }
        else if (Array.isArray(val) && (0, misc_1.isObject)(val[0])) {
            val.forEach((v) => normalizeDeep(v, callback, currentPath));
        }
        else if ((0, misc_1.isObject)(val)) {
            normalizeDeep(val, callback, currentPath);
        }
    }
}
function deepSort(value) {
    if (Array.isArray(value)) {
        return (0, lodash_1.default)(value)
            .sortBy((v) => {
            if ((0, misc_1.isObject)(v) && (0, misc_1.has)(v, 'id')) {
                return v.id;
            }
            return v;
        })
            .map((v) => deepSort(v));
    }
    if ((0, misc_1.isObject)(value)) {
        return (0, lodash_1.default)(value)
            .mapValues((v) => deepSort(v))
            .toPairs()
            .sortBy(0)
            .fromPairs()
            .value();
    }
    return value;
}
function prepareV1Data(data) {
    const prepared = { ...data };
    normalizeDeep(prepared, (path, val, parent) => {
        if (path.endsWith('.minimalBidStep') && typeof val === 'number') {
            return { minimalBidStep: val.toString() };
        }
        if (path.endsWith('.buyNowPrice') && val === '0') {
            return { buyNowPrice: null };
        }
        if (path.endsWith('.topBid') && (0, misc_1.isObject)(val) && (0, misc_1.has)(val, 'id') && (0, misc_1.has)(val, 'isCanceled')) {
            return {
                topBid: val.isCanceled &&
                    !data.bidMadeCompletingAuctionEvents.find((e) => e.winningBid.id === val.id) &&
                    !data.openAuctionBidAcceptedEvents.find((e) => e.winningBid?.id === val.id)
                    ? null
                    : { id: val.id },
            };
        }
        if (path.endsWith('.reactionsCountByReactionId') && Array.isArray(val) && val.length === 0) {
            return { reactionsCountByReactionId: null };
        }
        if (path.endsWith('.areas') && Array.isArray(val) && val.length === 0) {
            return { areas: null };
        }
        if (path.endsWith('.areas.area') && (0, misc_1.isObject)(val)) {
            return { ...val };
        }
        if (path.endsWith('storageBags.owner.channelId') && typeof val === 'number') {
            return { channelId: val.toString() };
        }
        if (path.endsWith('videoCategories.description') && val === '') {
            return { description: null };
        }
        if (path.endsWith('transactionalStatus.price') && typeof val === 'number') {
            return { price: BigInt(val).toString() };
        }
        if (path.endsWith('bids.isCanceled') &&
            val === true &&
            (0, misc_1.isObject)(parent) &&
            (0, misc_1.has)(parent, 'id') &&
            (data.bidMadeCompletingAuctionEvents.find((e) => e.winningBid.id === parent.id) ||
                data.openAuctionBidAcceptedEvents.find((e) => e.winningBid?.id === parent.id))) {
            // Known bug in Orion v1 - bid is getting canceled even when it's a winning bid in already completed auction
            // We also need to fix auction.topBid in this case (as it gets set to `null`)
            const auctionId = parent.auction.id;
            const auction = data.auctions.find((a) => a.id === auctionId);
            if (!auction) {
                throw new Error(`Auction ${auctionId} not found!`);
            }
            ;
            auction.topBid = { id: parent.id };
            return { isCanceled: false };
        }
        if (path.endsWith('.encoding') && (0, misc_1.isObject)(val) && (0, misc_1.has)(val, 'codecName')) {
            const encoding = val;
            if (encoding.codecName === null &&
                encoding.container === null &&
                encoding.mimeMediaType === null) {
                return { encoding: null };
            }
        }
    });
    return deepSort(prepared);
}
function prepareV2Data(data) {
    const prepared = { ...data };
    normalizeDeep(prepared, (path, val, parent) => {
        const lastKey = path.split('.').slice(-1)[0];
        if (lastKey === 'language' && typeof val === 'string') {
            return { language: { iso: val } };
        }
        if (typeof val === 'string' && val.match(/[0-9]000Z$/)) {
            return { [lastKey]: val.replace('000Z', 'Z') };
        }
        if (path.endsWith('Events.data') && (0, misc_1.isObject)(val)) {
            return { ...val };
        }
        if (path.endsWith('auctionBidCanceledEvents.bid') && (0, misc_1.isObject)(val)) {
            const bid = val;
            return {
                video: { id: bid.auction.nft.id },
            };
        }
        if (path.endsWith('auctionBidMadeEvents.bid') && (0, misc_1.isObject)(val)) {
            const bid = val;
            return {
                bidAmount: bid.amount,
                previousTopBid: bid.previousTopBid ? { id: bid.previousTopBid.id } : null,
                previousTopBidder: bid.previousTopBid?.bidder || null,
            };
        }
        if (path.endsWith('auctionCanceledEvents.auction') && (0, misc_1.isObject)(val)) {
            const auction = val;
            return { video: { id: auction.nft.id } };
        }
        if (path.endsWith('openAuctionStartedEvents.auction') && (0, misc_1.isObject)(val) && (0, misc_1.has)(val, 'nft')) {
            const auction = val;
            return { auction: { id: auction.id } };
        }
        if (path.endsWith('Events.nft')) {
            return { video: val };
        }
        if (path.endsWith('Events.id') &&
            !path.startsWith('OLYMPIA') &&
            (0, misc_1.isObject)(parent) &&
            (0, misc_1.has)(parent, 'inBlock') &&
            (0, misc_1.has)(parent, 'indexInBlock')) {
            // Convert to backward-compatible event id
            return { id: `OLYMPIA-${parent.inBlock}-${parent.indexInBlock}` };
        }
        if (lastKey === 'nftOwner' ||
            lastKey === 'previousNftOwner' ||
            path.endsWith('ownedNfts.owner')) {
            const nftOwner = val;
            if (nftOwner.__typename === 'NftOwnerChannel') {
                return {
                    ownerMember: nftOwner.channel.ownerMember,
                    ownerCuratorGroup: null,
                };
            }
            if (nftOwner.__typename === 'NftOwnerMember') {
                return {
                    ownerMember: nftOwner.member,
                    ownerCuratorGroup: null,
                };
            }
        }
        if (lastKey === 'transactionalStatus' &&
            (0, misc_1.isObject)(val) &&
            (0, misc_1.isObject)(parent) &&
            !('transactionalStatusAuction' in parent)) {
            const transactionalStatus = val;
            if (transactionalStatus.__typename === 'TransactionalStatusAuction') {
                return {
                    transactionalStatus: null,
                    transactionalStatusAuction: transactionalStatus.auction,
                };
            }
            else {
                return {
                    transactionalStatus: val,
                    transactionalStatusAuction: null,
                };
            }
        }
        if ((path.endsWith('.bannedMembers.member') ||
            path.endsWith('.whitelistedMembers.member') ||
            path.endsWith('.whitelistedInAuctions.auction') ||
            path.endsWith('.bags.bag') ||
            path.endsWith('.storageBuckets.storageBucket') ||
            path.endsWith('.distributionBuckets.distributionBucket')) &&
            (0, misc_1.isObject)(val) &&
            (0, misc_1.has)(val, 'id')) {
            return { id: val.id };
        }
        if (path.endsWith('Events.result') && (0, misc_1.isObject)(val)) {
            const result = val;
            if (result.__typename !== 'MetaprotocolTransactionResultFailed') {
                return {
                    status: {
                        __typename: 'MetaprotocolTransactionSuccessful',
                        commentCreated: result.commentCreated || null,
                        commentEdited: result.commentEdited || null,
                        commentDeleted: result.commentDeleted || null,
                        commentModerated: result.commentModerated || null,
                        videoCategoryCreated: result.videoCategoryCreated || null,
                        videoCategoryUpdated: result.videoCategoryUpdated || null,
                        videoCategoryDeleted: result.videoCategoryDeleted || null,
                    },
                };
            }
            else {
                return {
                    status: {
                        __typename: 'MetaprotocolTransactionErrored',
                    },
                };
            }
        }
        if (lastKey === 'winningBid' && (0, misc_1.isObject)(val) && (0, misc_1.has)(val, 'auction')) {
            const winningBid = val;
            if (path.includes('englishAuctionSettledEvents')) {
                return {
                    winningBid: { id: winningBid.id },
                    winner: { id: winningBid.bidder.id },
                    video: { id: winningBid.auction.nft.id },
                };
            }
            return {
                winningBid: { id: winningBid.id },
                video: { id: winningBid.auction.nft.id },
            };
        }
    });
    return deepSort(prepared);
}
async function compareState() {
    const config = {
        cache: new core_1.InMemoryCache({ addTypename: false }),
        defaultOptions: {
            query: { fetchPolicy: 'no-cache', errorPolicy: 'all' },
            mutate: { fetchPolicy: 'no-cache', errorPolicy: 'all' },
        },
    };
    const orionV1Url = process.env.ORION_V1_URL;
    const orionV2Url = process.env.ORION_V2_URL;
    console.log(`Orion V1 endpoint: ${orionV1Url}`);
    console.log(`Orion V2 endpoint: ${orionV2Url}`);
    const orionV1Client = new core_1.ApolloClient({
        link: new core_1.HttpLink({
            uri: orionV1Url,
        }),
        uri: orionV1Url,
        ...config,
    });
    const startV1 = performance.now();
    const v1Result = await orionV1Client.query({
        query: queries_1.StateQueryV1,
    });
    console.log(`V1 query took: ${performance.now() - startV1}`);
    console.log(!!v1Result.data);
    // console.log(v1Result.error)
    // console.log(v1Result.errors)
    const v1Data = prepareV1Data(v1Result.data);
    fs_1.default.writeFileSync('./resultV1.json', JSON.stringify(v1Data, null, 4));
    const operatorMiddleware = new core_1.ApolloLink((operation, forward) => {
        operation.setContext(({ headers = {} }) => ({
            headers: {
                ...headers,
                'x-operator-secret': process.env.OPERATOR_SECRET,
            },
        }));
        return forward(operation);
    });
    const orionV2Client = new core_1.ApolloClient({
        link: (0, core_1.from)([
            operatorMiddleware,
            new core_1.HttpLink({
                uri: orionV2Url,
            }),
        ]),
        ...config,
    });
    const startV2 = performance.now();
    const v2Result = await orionV2Client.query({
        query: queries_2.StateQueryV2,
    });
    console.log(`V2 query took: ${performance.now() - startV2}`);
    console.log(!!v2Result.data);
    const v2Data = prepareV2Data(v2Result.data);
    fs_1.default.writeFileSync('./resultV2.json', JSON.stringify(v2Data, null, 4));
    const execP = (0, util_1.promisify)(child_process_1.exec);
    try {
        await execP('git diff --no-index --color resultV1.json resultV2.json');
        console.log('OK');
    }
    catch (e) {
        if ((0, misc_1.isObject)(e) && (0, misc_1.has)(e, 'stdout')) {
            console.log('Diff encountered');
            console.log(e.stdout);
            process.exit(1);
        }
        else {
            throw e;
        }
    }
}
exports.compareState = compareState;
compareState()
    .then(() => process.exit(0))
    .catch(console.error);
//# sourceMappingURL=compareState.js.map