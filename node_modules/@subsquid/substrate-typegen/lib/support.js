"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageBase = void 0;
class StorageBase {
    constructor(ctx, block) {
        block = block || ctx.block;
        this.blockHash = block.hash;
        this._chain = ctx._chain;
    }
    getPrefix() {
        throw new Error('Not implemented');
    }
    getName() {
        throw new Error('Not implemented');
    }
    getTypeHash() {
        return this._chain.getStorageItemTypeHash(this.getPrefix(), this.getName());
    }
    /**
     * Checks whether the storage item is defined for the current chain version.
     */
    get isExists() {
        return this.getTypeHash() != null;
    }
    get(...args) {
        return this._chain.getStorage(this.blockHash, this.getPrefix(), this.getName(), ...args);
    }
    getMany(keyList) {
        return this._chain.queryStorage2(this.blockHash, this.getPrefix(), this.getName(), keyList);
    }
    getAll() {
        return this._chain.queryStorage2(this.blockHash, this.getPrefix(), this.getName());
    }
    getKeys(...args) {
        return this._chain.getKeys(this.blockHash, this.getPrefix(), this.getName(), ...args);
    }
    getKeysPaged(pageSize, ...args) {
        return this._chain.getKeysPaged(pageSize, this.blockHash, this.getPrefix(), this.getName(), ...args);
    }
    getPairs(...args) {
        return this._chain.getPairs(this.blockHash, this.getPrefix(), this.getName(), ...args);
    }
    getPairsPaged(pageSize, ...args) {
        return this._chain.getPairsPaged(pageSize, this.blockHash, this.getPrefix(), this.getName(), ...args);
    }
}
exports.StorageBase = StorageBase;
//# sourceMappingURL=support.js.map