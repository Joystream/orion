"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJsonAvatar = void 0;
const _avatarObject_1 = require("./_avatarObject");
const _avatarUri_1 = require("./_avatarUri");
function fromJsonAvatar(json) {
    switch (json?.isTypeOf) {
        case 'AvatarObject': return new _avatarObject_1.AvatarObject(undefined, json);
        case 'AvatarUri': return new _avatarUri_1.AvatarUri(undefined, json);
        default: throw new TypeError('Unknown json object passed as Avatar');
    }
}
exports.fromJsonAvatar = fromJsonAvatar;
//# sourceMappingURL=_avatar.js.map