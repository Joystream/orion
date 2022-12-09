"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJsonGeographicalArea = void 0;
const _geographicalAreaContinent_1 = require("./_geographicalAreaContinent");
const _geographicalAreaCountry_1 = require("./_geographicalAreaCountry");
const _geographicalAreaSubdivistion_1 = require("./_geographicalAreaSubdivistion");
function fromJsonGeographicalArea(json) {
    switch (json?.isTypeOf) {
        case 'GeographicalAreaContinent': return new _geographicalAreaContinent_1.GeographicalAreaContinent(undefined, json);
        case 'GeographicalAreaCountry': return new _geographicalAreaCountry_1.GeographicalAreaCountry(undefined, json);
        case 'GeographicalAreaSubdivistion': return new _geographicalAreaSubdivistion_1.GeographicalAreaSubdivistion(undefined, json);
        default: throw new TypeError('Unknown json object passed as GeographicalArea');
    }
}
exports.fromJsonGeographicalArea = fromJsonGeographicalArea;
//# sourceMappingURL=_geographicalArea.js.map