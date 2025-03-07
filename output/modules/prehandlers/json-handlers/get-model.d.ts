import { PrismaQlHandler } from "../../handler-registries/handler-registry.js";
export type FieldSummary = {
    name: string;
    type: string;
    isId: boolean;
    isUnique: boolean;
    isRelation: boolean;
};
export declare const getJsonModel: PrismaQlHandler<"GET", "MODEL", "query">;
//# sourceMappingURL=get-model.d.ts.map