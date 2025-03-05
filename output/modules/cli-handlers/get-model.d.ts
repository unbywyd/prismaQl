import { Handler } from "../handler-registries/handler-registry.js";
import { Relation } from "../relation-collector.js";
import { Model } from "@mrleebo/prisma-ast";
export type FieldSummary = {
    name: string;
    type: string;
    isId: boolean;
    isUnique: boolean;
    isRelation: boolean;
};
export declare function extractModelSummary(model: Model, relations: Relation[]): FieldSummary[];
export declare const getModel: Handler<"GET", "MODEL">;
//# sourceMappingURL=get-model.d.ts.map