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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateResolver = void 0;
const type_graphql_1 = require("type-graphql");
const types_1 = require("./types");
const lodash_1 = __importStar(require("lodash"));
const globalEm_1 = require("../../../utils/globalEm");
const misc_1 = require("../../../utils/misc");
class ProcessorStateRetriever {
    run(intervalMs) {
        this.updateLoop(intervalMs)
            .then(() => {
            /* Do nothing */
        })
            .catch((err) => {
            console.error(err);
            process.exit(-1);
        });
    }
    async updateLoop(intervalMs) {
        this.em = await globalEm_1.globalEm;
        while (true) {
            try {
                this.state = await this.getUpdatedState();
            }
            catch (e) {
                console.error('Cannot get updated state', e);
            }
            await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }
    }
    async getUpdatedState() {
        const dbResult = await this.em.query('SELECT "height" FROM "squid_processor"."status"');
        return {
            lastProcessedBlock: Array.isArray(dbResult) &&
                (0, lodash_1.isObject)(dbResult[0]) &&
                (0, misc_1.has)(dbResult[0], 'height') &&
                typeof dbResult[0].height === 'number'
                ? dbResult[0].height
                : -1,
        };
    }
}
const processorStateRetriever = new ProcessorStateRetriever();
processorStateRetriever.run(1000);
async function* processorStateGenerator() {
    let lastState;
    while (1) {
        const currentState = processorStateRetriever.state;
        if (!lodash_1.default.isEqual(currentState, lastState)) {
            yield currentState;
            lastState = currentState;
        }
        // 100ms interval when checking for updates
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
}
let StateResolver = class StateResolver {
    // Set by depenency injection
    constructor(tx) {
        this.tx = tx;
    }
    processorState(state) {
        return state;
    }
};
__decorate([
    (0, type_graphql_1.Subscription)({
        subscribe: () => processorStateGenerator(),
    }),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.ProcessorState]),
    __metadata("design:returntype", types_1.ProcessorState)
], StateResolver.prototype, "processorState", null);
StateResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], StateResolver);
exports.StateResolver = StateResolver;
//# sourceMappingURL=index.js.map