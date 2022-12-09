"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.benchmark = void 0;
const core_1 = require("@apollo/client/core");
const lodash_1 = __importDefault(require("lodash"));
const math_1 = require("../../utils/math");
const testCases_1 = require("./testCases");
const chalk_1 = __importDefault(require("chalk"));
const misc_1 = require("../../utils/misc");
function formatImprovement(improvement) {
    if (improvement > 100) {
        return chalk_1.default.greenBright(improvement.toFixed(2) + '%');
    }
    if (improvement > 25) {
        return chalk_1.default.green(improvement.toFixed(2) + '%');
    }
    if (improvement < 0) {
        return chalk_1.default.red(improvement.toFixed(2) + '%');
    }
    return chalk_1.default.yellow(improvement.toFixed(2) + '%');
}
function printRatios(avgImprovements, medianImprovements) {
    console.log('On average, the average improvement in query execution time in Orion v2 vs Orion v1 is: ', formatImprovement(lodash_1.default.mean(avgImprovements)));
    console.log(`The median of average improvement in query execution time in Orion v2 vs Orion v1 is: `, formatImprovement((0, math_1.median)(avgImprovements)));
    console.log(`On average, the median improvement in query execution time in Orion v2 vs Orion v1 is: `, formatImprovement(lodash_1.default.mean(medianImprovements)));
    console.log(`The median of median improvement in query execution time in Orion v2 vs Orion v1 is:`, formatImprovement((0, math_1.median)(medianImprovements)));
}
function calculateRows(data) {
    if (!(0, misc_1.isObject)(data)) {
        return -1;
    }
    return Object.entries(data).reduce((totalRows, [qName, qResult]) => {
        if ((0, misc_1.isObject)(qResult) && (0, misc_1.has)(qResult, 'edges') && Array.isArray(qResult.edges)) {
            return totalRows + qResult.edges.length;
        }
        else if (Array.isArray(qResult)) {
            return totalRows + qResult.length;
        }
        else if ((0, misc_1.isObject)(qResult)) {
            return totalRows + 1;
        }
        else if (qResult === null) {
            return totalRows;
        }
        else {
            console.error(`Unrecognized result on key ${qName}:`, qResult);
            throw new Error('Unexpected query result');
        }
    }, 0);
}
function printFinalResults(queryTimeCategories = [
    [0, Infinity],
    [0, 100],
    [101, 500],
    [501, 2000],
    [2000, Infinity],
]) {
    for (const [min, max] of queryTimeCategories) {
        console.log(`========= QUERIES IN ${min}ms - ${max === Infinity ? 'Infinity' : `${max}ms`} RANGE =========`);
        const avgImprovements = testCases_1.testCases.flatMap(({ inputs }) => inputs.flatMap(({ v1Results, v2Results }) => {
            const improvement = ((lodash_1.default.mean(v1Results) - lodash_1.default.mean(v2Results)) /
                Math.min(lodash_1.default.mean(v1Results), lodash_1.default.mean(v2Results))) *
                100;
            return lodash_1.default.mean(v1Results) >= min && lodash_1.default.mean(v1Results) <= max ? [improvement] : [];
        }));
        const medianImprovements = testCases_1.testCases.flatMap(({ inputs }) => inputs.flatMap(({ v1Results, v2Results }) => {
            const improvement = (((0, math_1.median)(v1Results) - (0, math_1.median)(v2Results)) /
                Math.min((0, math_1.median)(v1Results), (0, math_1.median)(v2Results))) *
                100;
            return lodash_1.default.mean(v1Results) >= min && lodash_1.default.mean(v1Results) <= max ? [improvement] : [];
        }));
        console.log(`Tested queries in this range: ${avgImprovements.length}`);
        if (avgImprovements.length) {
            printRatios(avgImprovements, medianImprovements);
        }
    }
}
async function benchmark() {
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
    const orionV2Client = new core_1.ApolloClient({
        link: new core_1.HttpLink({
            uri: orionV2Url,
        }),
        ...config,
    });
    const executionsPerCase = 5;
    for (const { v1Query, v2Query, inputs } of testCases_1.testCases) {
        for (const { v1Input, v2Input, v1Results, v2Results } of inputs) {
            let dataV1, dataV2;
            for (let i = 0; i < executionsPerCase; ++i) {
                const startV1 = performance.now();
                dataV1 = (await orionV1Client.query({ query: v1Query, variables: v1Input })).data;
                const endV1 = performance.now();
                v1Results.push(endV1 - startV1);
                const startV2 = performance.now();
                dataV2 = (await orionV2Client.query({ query: v2Query, variables: v2Input })).data;
                const endV2 = performance.now();
                v2Results.push(endV2 - startV2);
            }
            const v1Rows = calculateRows(dataV1);
            const v2Rows = calculateRows(dataV2);
            const v1QueryName = v1Query.definitions[0].name?.value;
            const v2QueryName = v2Query.definitions[0].name?.value;
            console.log({
                v1Query: v1QueryName,
                v2Query: v2QueryName,
                v1Input,
                v2Input,
                v1Rows,
                v2Rows,
                v1Results,
                v2Results,
                v1Avg: lodash_1.default.mean(v1Results),
                v2Avg: lodash_1.default.mean(v2Results),
            });
            if (v1Rows !== v2Rows) {
                throw new Error('Number of rows returned does not match!');
            }
        }
    }
    printFinalResults();
}
exports.benchmark = benchmark;
benchmark()
    .then(() => process.exit(0))
    .catch(console.error);
//# sourceMappingURL=index.js.map