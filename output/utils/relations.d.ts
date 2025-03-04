import { createPrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import type { DMMF } from "@prisma/generator-helper";
export type RelationType = "1:1" | "1:M" | "M:N";
export interface Relation {
    type: RelationType;
    fieldName?: string;
    modelName: string;
    relatedModel: string;
    foreignKey?: string;
    referenceKey?: string;
    inverseField?: string;
    relationDirection?: "forward" | "backward" | "bidirectional";
    relationTable?: string;
    relationName: string;
    constraints?: string[];
}
type Model = DMMF.Model;
/**
 * Function to detect one-to-one relationships in Prisma DMMF models.
 * It now detects **both** sides of the relationship (forward & reverse).
 */
export declare function detectOneToOneRelations(models: Model[]): Relation[];
export declare function detectOneToManyRelations(models: Model[]): Relation[];
export declare function detectManyToManyRelations(models: Model[]): Relation[];
export declare function detectExplicitManyToManyRelations(models: Model[]): Relation[];
export declare function buildModelTrees(rootModel: string, relations: Relation[], maxDepth: number, depth?: number, visitedModels?: Set<string>): {
    trees: Record<string, any>[];
    models: Set<string>;
    relations: Set<string>;
};
export declare function collectRelationStatistics(models: Set<string>, relations: Set<string>, maxDepth: number): {
    uniqueModels: number;
    totalRelations: number;
    maxDepth: number;
};
export declare function generateRelationTree(rootModel: string, builder: ReturnType<typeof createPrismaSchemaBuilder>, maxDepth?: number): Promise<void>;
export {};
//# sourceMappingURL=relations.d.ts.map