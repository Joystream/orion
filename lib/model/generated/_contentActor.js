"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJsonContentActor = void 0;
const _contentActorCurator_1 = require("./_contentActorCurator");
const _contentActorMember_1 = require("./_contentActorMember");
const _contentActorLead_1 = require("./_contentActorLead");
function fromJsonContentActor(json) {
    switch (json?.isTypeOf) {
        case 'ContentActorCurator': return new _contentActorCurator_1.ContentActorCurator(undefined, json);
        case 'ContentActorMember': return new _contentActorMember_1.ContentActorMember(undefined, json);
        case 'ContentActorLead': return new _contentActorLead_1.ContentActorLead(undefined, json);
        default: throw new TypeError('Unknown json object passed as ContentActor');
    }
}
exports.fromJsonContentActor = fromJsonContentActor;
//# sourceMappingURL=_contentActor.js.map