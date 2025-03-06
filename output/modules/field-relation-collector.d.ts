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
export declare class PrismaRelationCollector {
    private models;
    private relations;
    getRelations(): Relation[];
    setModels(models: Model[]): Promise<Relation[]>;
    constructor(models?: Model[]);
    getRelation(modelName: string, fieldName: string): Relation | null;
    /**
 * Function to detect one-to-one relationships in Prisma DMMF models.
 * It now detects **both** sides of the relationship (forward & reverse).
 */
    detectOneToOneRelations(models: Model[]): Relation[];
    detectOneToManyRelations(models: Model[]): Relation[];
    private getManyToManyTableName;
    detectManyToManyRelations(models: Model[]): Relation[];
    detectExplicitManyToManyRelations(models: Model[]): Relation[];
    private deduplicateRelations;
    collectRelations(models: Model[]): Promise<Relation[]>;
    parsePrismaSchema(schema?: string): Promise<void>;
}
export declare const getManyToManyTableName: (modelA: string, modelB: string, relationName?: string) => string;
export {};
//# sourceMappingURL=field-relation-collector.d.ts.map