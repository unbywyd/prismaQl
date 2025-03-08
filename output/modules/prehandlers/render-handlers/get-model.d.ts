import { PrismaQlHandler } from "../../handler-registries/handler-registry.js";
export interface FieldSummary {
    name: string;
    type: string;
    isId: boolean;
    isUnique: boolean;
    isRelation: boolean;
}
export declare const getModel: PrismaQlHandler<"GET", "MODEL", "query">;
//# sourceMappingURL=get-model.d.ts.map