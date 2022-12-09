"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withHiddenEntities = exports.extendClause = exports.overrideClause = exports.getForcedClauseRange = exports.getClauseRange = exports.getStartIndexOfOutermost = exports.selectQueryClauses = void 0;
const lodash_1 = __importDefault(require("lodash"));
exports.selectQueryClauses = [
    'SELECT',
    'FROM',
    'WHERE',
    'GROUP BY',
    'HAVING',
    'ORDER BY',
    'LIMIT',
    'OFFSET',
];
function getStartIndexOfOutermost(selectQuery, clause) {
    let index = -1;
    while (selectQuery.indexOf(clause, index + 1) !== -1) {
        index = selectQuery.indexOf(clause, index + 1);
        const substrCounts = lodash_1.default.countBy(selectQuery.substring(0, index), (v) => v);
        if (substrCounts['('] === substrCounts[')']) {
            return index;
        }
    }
    return undefined;
}
exports.getStartIndexOfOutermost = getStartIndexOfOutermost;
function getClauseRange(selectQuery, clause) {
    const startIndex = getStartIndexOfOutermost(selectQuery, clause);
    if (startIndex === undefined) {
        return undefined;
    }
    let endIndex;
    for (let nextClauseIndex = exports.selectQueryClauses.indexOf(clause) + 1; endIndex === undefined && nextClauseIndex < exports.selectQueryClauses.length; ++nextClauseIndex) {
        endIndex = getStartIndexOfOutermost(selectQuery, exports.selectQueryClauses[nextClauseIndex]);
    }
    return [startIndex + clause.length, endIndex];
}
exports.getClauseRange = getClauseRange;
function getForcedClauseRange(selectQuery, clause) {
    let clauseRange = getClauseRange(selectQuery, clause);
    for (let clauseIndex = exports.selectQueryClauses.indexOf(clause) - 1; clauseRange === undefined && clauseIndex >= 0; --clauseIndex) {
        const previousClause = exports.selectQueryClauses[clauseIndex];
        const previousClauseRange = getClauseRange(selectQuery, previousClause);
        clauseRange = previousClauseRange
            ? [previousClauseRange[1] || selectQuery.length, previousClauseRange[1] || selectQuery.length]
            : undefined;
    }
    if (!clauseRange) {
        throw new Error(`Cannot forcefully determine range of ${clause} clause in query: ${selectQuery}`);
    }
    return clauseRange;
}
exports.getForcedClauseRange = getForcedClauseRange;
function overrideClause(selectQuery, clause, newValue) {
    const clauseRange = getForcedClauseRange(selectQuery, clause);
    return (selectQuery.substring(0, clauseRange[0]) +
        (clauseRange[0] === clauseRange[1] ? ` ${clause} ${newValue} ` : ` ${newValue} `) +
        selectQuery.substring(clauseRange[1]));
}
exports.overrideClause = overrideClause;
function extendClause(selectQuery, clause, extension, glue = ',') {
    const clauseRange = getForcedClauseRange(selectQuery, clause);
    if (clauseRange[0] === clauseRange[1]) {
        // Clause is missing
        return (selectQuery.substring(0, clauseRange[0]) +
            ` ${clause} ${extension} ` +
            selectQuery.substring(clauseRange[1]));
    }
    const addParenthesis = clause === 'WHERE';
    return (selectQuery.substring(0, clauseRange[0]) +
        (addParenthesis ? ' (' : ' ') +
        selectQuery.substring(clauseRange[0], clauseRange[1]) +
        (addParenthesis ? ') ' : ' ') +
        `${glue} ${extension} ` +
        (clauseRange[1] ? selectQuery.substring(clauseRange[1]) : ''));
}
exports.extendClause = extendClause;
async function withHiddenEntities(em, func) {
    const previousSearchPath = (await em.query('SHOW search_path'))[0]?.search_path || 'DEFAULT';
    await em.query('SET LOCAL search_path TO admin,public');
    const result = await func();
    await em.query(`SET LOCAL search_path TO ${previousSearchPath}`);
    return result;
}
exports.withHiddenEntities = withHiddenEntities;
//# sourceMappingURL=sql.js.map