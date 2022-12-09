import type { Connection, EntityManager } from "typeorm";
import type { IsolationLevel } from "./database";
export interface Tx {
    em: EntityManager;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}
export declare function createTransaction(con: Connection, isolationLevel: IsolationLevel): Promise<Tx>;
//# sourceMappingURL=tx.d.ts.map