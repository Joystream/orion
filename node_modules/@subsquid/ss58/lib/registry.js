"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registry = void 0;
class Registry {
    constructor(items) {
        this.byPrefix = new Map();
        this.byNetwork = new Map();
        this.items = items.slice();
        this.items.forEach(item => {
            if (this.byPrefix.has(item.prefix)) {
                throw new Error(`Duplicate prefix ${item.prefix}`);
            }
            else {
                this.byPrefix.set(item.prefix, item);
            }
            if (this.byNetwork.has(item.network)) {
                throw new Error(`Duplicate network ${item.network}`);
            }
            else {
                this.byNetwork.set(item.network, item);
            }
        });
    }
    get(networkOrPrefix) {
        if (typeof networkOrPrefix == 'string') {
            let item = this.byNetwork.get(networkOrPrefix);
            if (item == null)
                throw new Error(`No entry for network ${networkOrPrefix}`);
            return item;
        }
        else {
            let item = this.byPrefix.get(networkOrPrefix);
            if (item == null)
                throw new Error(`No entry for prefix ${networkOrPrefix}`);
            return item;
        }
    }
    find(networkOrPrefix) {
        if (typeof networkOrPrefix == 'string') {
            return this.byNetwork.get(networkOrPrefix);
        }
        else {
            return this.byPrefix.get(networkOrPrefix);
        }
    }
}
exports.Registry = Registry;
//# sourceMappingURL=registry.js.map